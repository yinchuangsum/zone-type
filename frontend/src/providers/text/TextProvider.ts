export interface TextProvider {
  getText(): Promise<string>
}