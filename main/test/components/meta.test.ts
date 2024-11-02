import { robots, SITE_NAME } from '@/consts/meta'
import meta, { metaProps } from '../../src/components/meta'

describe('meta function', () => {
  const mockMeta: metaProps = {
    title: 'Test Title',
    url: 'https://www.jamiebyrne.com',
    description: 'Test Description',
    image: 'https://www.jamiebyrne.com/image.jpg'
  }

  const defaultCrawlers = robots

  it('should return metadata with correct structure', () => {
    const result = meta(mockMeta)

    expect(result).toEqual({
      title: mockMeta.title,
      metadataBase: new URL(mockMeta.url),
      description: mockMeta.description,
      robots: defaultCrawlers
    })
  })

  it('should use robots when provided', () => {
    const customCrawlers = robots
    const result = meta(mockMeta, customCrawlers)

    expect(result.robots).toBe(customCrawlers)
  })

  it('should handle optional crawlers parameter', () => {
    const result = meta(mockMeta, undefined)

    expect(result.robots).toBe(defaultCrawlers)
  })
})
