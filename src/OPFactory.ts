import { CreateBondAndTreasuryCall, CreateBondCall } from "../generated/OlympusProFactory/OlympusProFactory"
import { UniswapV2Pair } from "../generated/OlympusProFactory/UniswapV2Pair"
import { ERC20 } from "../generated/OlympusProFactory/ERC20"
import { Bond } from "../generated/schema"
import { toDecimal } from "./utils/Decimals"
import { Address, BigDecimal } from "@graphprotocol/graph-ts"

export function createBond(call: CreateBondCall): void {
    initBond(
        call.outputs._bond.toHexString(),
        toDecimal(call.inputs._fees.pop(),4),
        call.inputs._customTreasury.toHexString(),
        call.inputs._payoutToken.toHexString(),
        call.inputs._principleToken.toHexString(),
        call.inputs._initialOwner.toHexString()
    )
}

export function createBondAndTreasury(call: CreateBondAndTreasuryCall): void {
    initBond(
        call.outputs._bond.toHexString(),
        toDecimal(call.inputs._fees.pop(),4),
        call.outputs._treasury.toHexString(),
        call.inputs._payoutToken.toHexString(),
        call.inputs._principleToken.toHexString(),
        call.inputs._initialOwner.toHexString()
    )
}

function initBond(
    id: string,
    fees: BigDecimal,
    treasury: string,
    payoutToken: string,
    principleToken: string,
    owner: string
): void {
    let bond = new Bond(id)
    bond.fees = fees
    bond.treasury = treasury
    bond.payoutToken = payoutToken
    bond.principleToken = principleToken
    bond.owner = owner

    let pair = UniswapV2Pair.bind(Address.fromString(principleToken))
    bond.token0 = pair.token0().toHexString()
    bond.token1 = pair.token1().toHexString()

    let token0erc20 = ERC20.bind(pair.token0())
    let token1erc20 = ERC20.bind(pair.token1())
    bond.name = token0erc20.symbol() + "-" + token1erc20.symbol()

    bond.save()
}