import { Address, log, BigInt, BigDecimal } from "@graphprotocol/graph-ts"
import { ERC20 } from "../generated/OlympusProFactory/ERC20"
import { Bond, UserBond } from "../generated/schema"
import { BondCreated } from "../generated/templates/CustomBond/CustomBond"
import { NATIVE_TOKEN } from "./utils/Constants"
import { toDecimal } from "./utils/Decimals"
import { getPairUSD, getSwap } from "./utils/Price"

export function handleBondCreated(event: BondCreated): void {

    log.debug("BondCreated", [])

    let bond = Bond.load(event.address.toHexString())

    let erc20Bonded = ERC20.bind(Address.fromString(bond.principleToken))
    let bondedAmount = toDecimal(event.params.deposit, erc20Bonded.decimals())
    let bondedUSDValue = BigDecimal.fromString("0")
    if(bond.type=="LP"){
        bondedUSDValue = getPairUSD(event.params.deposit, bond.principleToken)
    }
    else {
        bondedUSDValue = getSwap(bond.payoutToken, NATIVE_TOKEN, true)
    }

    let erc20Payout = ERC20.bind(Address.fromString(bond.payoutToken))
    let payoutAmount = toDecimal(event.params.payout, erc20Payout.decimals())
    let payoutUSDValue = getSwap(bond.payoutToken, NATIVE_TOKEN, true).times(payoutAmount)

    let userbond = new UserBond(event.transaction.hash.toHexString())
    userbond.bond = bond.id
    userbond.deposit = bondedAmount
    userbond.depositUSD = bondedUSDValue
    userbond.payout = payoutAmount
    userbond.payoutUSD = payoutUSDValue
    userbond.save()

    log.debug(" Deposit in bond: {} Principle amount: {} USD Value: {}", [event.transaction.hash.toHexString(), bondedAmount.toString(), bondedUSDValue.toString()])
    log.debug("Payout in bond: {} Principle amount: {} USD Value: {}", [event.transaction.hash.toHexString(), payoutAmount.toString(), payoutUSDValue.toString() ])
}