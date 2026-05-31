import { env } from '../config/env'

export function getAddressUrl(address: string): string {
  return `${env.etherscanBaseUrl}/address/${address}`
}

export function getTxUrl(hash: string): string {
  return `${env.etherscanBaseUrl}/tx/${hash}`
}

export function getBlockUrl(blockNumber: bigint | number): string {
  return `${env.etherscanBaseUrl}/block/${blockNumber.toString()}`
}
