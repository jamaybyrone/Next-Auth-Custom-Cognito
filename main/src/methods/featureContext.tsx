import { useContext, createContext, ReactNode, useMemo } from 'react'

const FeatureContext = createContext('features')

export interface FeatureType {
  gitHubEnabled: boolean
  googleEnabled: boolean
}

interface ProviderProps {
  children: ReactNode
  feature: FeatureType
}
function FeatureProvider({ children, feature }: Readonly<ProviderProps>) {
  const value = useMemo(() => feature, [feature])
  return (
    <FeatureContext.Provider value={value as any}>
      {children}
    </FeatureContext.Provider>
  )
}

function useFeatures(): FeatureType {
  return useContext(FeatureContext) as unknown as FeatureType
}

export { FeatureProvider, useFeatures }
