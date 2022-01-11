import { NATIVE_TOKEN, STABLE_TOKEN, ROUTERS } from './Constants'
import { Address, BigDecimal, BigInt, log } from '@graphprotocol/graph-ts'
import { UniswapRouter } from '../../generated/OlympusProFactory/UniswapRouter';
import { toDecimal } from './Decimals'
import { ERC20 } from '../../generated/OlympusProFactory/ERC20';
import { UniswapV2Pair } from '../../generated/OlympusProFactory/UniswapV2Pair';

function removeDuplicatePath(path: Address[]): Address[] {
    return path.filter(function(item, pos, arr){
        return pos === 0 || item !== arr[pos-1];
    });
}

export function getSwap(tokenIn: string, tokenOut: string, usdOut: boolean): BigDecimal{
    log.debug("Swap Rate {} {}", [tokenIn, tokenOut])

    for (let i = 0; i < ROUTERS.length; i++) {
        
        let routerAdress = ROUTERS[i]

        log.debug("Using Router {}", [routerAdress])

        let router = UniswapRouter.bind(Address.fromString(routerAdress))
        let tokenInERC20 = ERC20.bind(Address.fromString(tokenIn))
        let tokenOutERC20 = ERC20.bind(Address.fromString(tokenOut))

        let path: Address[] = [Address.fromString(tokenIn), Address.fromString(tokenOut)];

        if(tokenIn==NATIVE_TOKEN && tokenOut==NATIVE_TOKEN){
            return BigDecimal.fromString("1")
        }

        let rateQuery = router.try_getAmountsOut(
            BigInt.fromI32(10).pow(<u8>tokenInERC20.decimals()), 
            path
        )

        if (rateQuery.reverted == false){
            let swapRate = toDecimal(rateQuery.value.pop(),tokenOutERC20.decimals())
            log.debug("Rate Result {}", [swapRate.toString()])
            if(usdOut){
                swapRate = swapRate.times(getNativeUSDRate())
                log.debug("USD Rate Result {}", [swapRate.toString()])
            }
            log.debug("Swap Rate {} {} rate {}", [tokenIn, tokenOut, swapRate.toString()])
            return swapRate
        }
        else {
            log.error("Issue getting rate {} {}", [tokenIn, tokenOut])
        }
    }
    return BigDecimal.fromString("0")
}

export function getNativeUSDRate(): BigDecimal {
    return getSwap(NATIVE_TOKEN, STABLE_TOKEN, false)
}

export function getPairUSD(lp_amount: BigInt, pair_adress: string): BigDecimal{
    let pair = UniswapV2Pair.bind(Address.fromString(pair_adress))
    let total_lp = pair.totalSupply()
    
    let isV2Pair = pair.try_getReserves()
    if(isV2Pair.reverted){
        log.error("V3 LP valuation not supported",[])
        return BigDecimal.fromString("0")
    }
    let lp_token_reserves = pair.getReserves().value0
    let token = pair.token0()

    let lpDecimal = toDecimal(lp_amount,pair.decimals())
    log.debug("LPPAIR lpDecimal {}", [lpDecimal.toString()])

    let ownedLP = lpDecimal.div(toDecimal(total_lp,pair.decimals()))
    log.debug("LPPAIR ownedLP {}", [ownedLP.toString()])

    let tokenERC20 = ERC20.bind(token)
 
    let token_price = getSwap(token.toHexString(), NATIVE_TOKEN, true)
    log.debug("LPPAIR token_price {}", [token_price.toString()])
    let token_value_in_lp = toDecimal(lp_token_reserves, tokenERC20.decimals()).times(token_price)
    log.debug("LPPAIR token_value_in_lp {}", [token_value_in_lp.toString()])
    let total_lp_usd = token_value_in_lp.times(BigDecimal.fromString("2")).times(ownedLP)
    log.debug("LPPAIR total_lp_usd {}", [total_lp_usd.toString()])

    return total_lp_usd
}