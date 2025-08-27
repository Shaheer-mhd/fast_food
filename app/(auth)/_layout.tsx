import { Slot } from 'expo-router'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const AuthLayout = () => {
  return (
    <SafeAreaView>
        <Slot />
    </SafeAreaView>
  )
}

export default AuthLayout