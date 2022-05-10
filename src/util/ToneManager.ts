import TonePlayer from './TonePlayer'
import { phoneStore } from '../index'

class ToneManager {
  currentTone: any

  playRing(type: string) {
    return
    const state = phoneStore.getState()
    // @ts-ignore
    const deviceId = state.device.primaryAudioOutput
    if (this.currentTone) {
      this.currentTone.stop()
      this.currentTone = undefined
    }
    if (type === 'ringback') {
      this.currentTone = new TonePlayer()
      this.currentTone.ringback(deviceId)
    } else if (type == 'ringtone') {
      this.currentTone = new TonePlayer()
      this.currentTone.ringtone(deviceId)
    }
  }

  stopAll() {
    return
    if (this.currentTone) {
      this.currentTone.stop()
      this.currentTone = undefined
    }
  }
}

const toneManager = new ToneManager()
export default toneManager
