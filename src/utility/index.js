import { Notify } from 'quasar'

export const notify = {
  success (props, caption) {
    const options = {
      color: `positive`,
      icon:  `mdi-check-bold`,
    }
    if (typeof props === `string`) Notify.create({ ...options, message: props, caption })
    if (typeof props === `object`) Notify.create({ ...options, ...props })
  },

  error (props, rawError) {
    if (rawError && isDevOrStaging()) console.error(rawError)
    const options = {
      color:   `negative`,
      icon:    `mdi-close-thick`,
      timeout: 5000
    }
    if (typeof props === `string`) Notify.create({ ...options, message: props })
    if (typeof props === `object`) Notify.create({ ...options, ...props })
  }
}

export const validate = {
  required (val) {
    return !!val || "Bu alanın doldurulması zorunludur"
  },
  minChar (val) {
    return val.length >= 5 || "Şifre en az 5 karakterden oluşmalı"
  },
}