import type { TextProvider } from './TextProvider'

export interface HardcodedTextProviderOptions {
  texts?: string[]
}

const DEFAULT_TEXT = 'the quick brown fox jumps over the lazy dog'

export class HardcodedTextProvider implements TextProvider {
  private texts: string[]

  constructor(options: HardcodedTextProviderOptions = {}) {
    this.texts = options.texts ?? [DEFAULT_TEXT]
  }

  async getText(): Promise<string> {
    const index = Math.floor(Math.random() * this.texts.length)
    return this.texts[index]
  }
}