import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/storage'

const state = {
  loading: true,
  files: []
}
const getters = {
  /**
   * Returns true if binder is refreshing page content from firebase
   */
  loading: (context) => () => {
    return context.loading
  },
  files: (context) => () => {
    return context.files
  }
}
const mutations = {
  reset (context) {
    Vue.set(context, 'loading', true)
    Vue.set(context, 'files', [])
  },
  loading (context, loading) {
    Vue.set(context, 'loading', loading)
  },
  patchFile (context, data) {
    // console.log(data)
    let filesArray = context.files
    filesArray.push(data)
    Vue.set(context, 'files', filesArray)
  }
}
const actions = {
  fetch (context, { siteid }) {
    context.commit('reset')

    const storage = firebase.storage()

    const listRef = storage.ref(siteid)
    listRef.listAll().then((res) => {
      res.prefixes.forEach((folderRef) => {
        // All the prefixes under listRef.
        // You may call listAll() recursively on them.
      })
      res.items.forEach((itemRef) => {
        // All the items under listRef.
        // console.log(itemRef)
        context.commit('patchFile', {
          name: itemRef.name,
          path: itemRef.fullPath
        })
      })
      context.commit('loading', false)
    }).catch((error) => {
      // Uh-oh, an error occurred!
      console.log(error)
    })
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
