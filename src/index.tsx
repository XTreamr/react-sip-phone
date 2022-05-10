import React, { useContext, useEffect } from 'react'
import { Provider, useSelector } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { getInputAudioDevices, getOutputAudioDevices } from './actions/device'
import { acceptCall, declineCall, endCall } from './actions/sipSessions'
import { AppConfig, PhoneConfig, SipConfig, SipCredentials } from './models'
import SipWrapper from './SipWrapper'
import { defaultStore, persistor } from './store/configureStore'

export const phoneStore = defaultStore
interface Props {
  width: number
  height: number
  name: string
  phoneConfig: PhoneConfig
  sipCredentials: SipCredentials
  sipConfig: SipConfig
  appConfig: AppConfig
  containerStyle: any
  children: any
}

const SIPContext = React.createContext({})

const SIP = ({ children }: { children: any }) => {
  const state = useSelector((state: any) => state)

  const makeCall = state?.sipAccounts?.sipAccount?.makeCall

  useEffect(() => {
    getInputAudioDevices()
    getOutputAudioDevices()
  }, [])

  return (
    <SIPContext.Provider
      value={{ state, makeCall, acceptCall, declineCall, endCall }}
    >
      {children}
    </SIPContext.Provider>
  )
}

export const SIPProvider = ({
  name,
  phoneConfig,
  sipConfig,
  appConfig,
  sipCredentials,
  containerStyle = {},
  children
}: Props) => {
  console.info(name, containerStyle)
  return (
    <Provider store={phoneStore}>
      <PersistGate loading={null} persistor={persistor}>
        <SipWrapper
          sipConfig={sipConfig}
          sipCredentials={sipCredentials}
          phoneConfig={phoneConfig}
          appConfig={appConfig}
        >
          <SIP>{children}</SIP>
          <audio id='tone' autoPlay />
        </SipWrapper>
      </PersistGate>
    </Provider>
  )
}

export const useSip = () => {
  const ctx = useContext(SIPContext)
  return ctx
}
