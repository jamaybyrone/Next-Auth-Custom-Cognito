import { useContext, createContext, ReactNode, useMemo } from 'react'

export interface FeatureType {
  gitHubEnabled: boolean
  googleEnabled: boolean
}

interface ProviderProps {
  children: ReactNode
  feature: FeatureType
}

const FeatureContext = createContext<FeatureType | undefined>(undefined)

function FeatureProvider({ children, feature }: Readonly<ProviderProps>) {
  const value = useMemo(() => feature, [feature])

  return (
    <FeatureContext.Provider value={value}>{children}</FeatureContext.Provider>
  )
}

function useFeatures(): FeatureType {
  const context = useContext(FeatureContext)
  if (!context) {
    throw new Error('useFeatures must be used within a FeatureProvider')
  }
  return context
}

export { FeatureProvider, useFeatures }
