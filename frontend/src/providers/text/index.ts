import { inject, type InjectionKey } from 'vue'
import type { TextProvider } from './TextProvider'

export type { TextProvider } from './TextProvider'
export { HardcodedTextProvider } from './HardcodedTextProvider'
export type { HardcodedTextProviderOptions } from './HardcodedTextProvider'

export const TEXT_PROVIDER_KEY: InjectionKey<TextProvider> = Symbol('text-provider')

export function useTextProvider(): TextProvider {
  const provider = inject(TEXT_PROVIDER_KEY)
  if (!provider) {
    throw new Error('TextProvider not provided. Did you forget to app.provide(TEXT_PROVIDER_KEY, ...)?')
  }
  return provider
}