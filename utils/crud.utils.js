class Crud {
  constructor(getDatabaseReference, getMessagingIprepApp) {
    this.db = getDatabaseReference();
    if (getMessagingIprepApp) this.messagingAdmin = getMessagingIprepApp();
  }

  getOnValueChangeSync = (path) => {
    return new Promise((resolve, reject) => {
      try {
        this.db.child(path).on('value', (snapshot) => {
          if (snapshot && snapshot.val()) {
            resolve(snapshot.val());
          } else {
            reject();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  getValueSync = (path) => {
    return new Promise((resolve, reject) => {
      try {
        this.db
          .child(path)
          .once('value')
          .then((snapshot) => {
            const data = snapshot.val();
            return resolve({ error: null, data });
          })
          .catch((error) => {
            return resolve({ error });
          });
      } catch (error) {
        console.log('getValueSync: ', path, error);
        return reject(error);
      }
    });
  };

  getValueAsync = (path, next) => {
    try {
      this.db
        .child(path)
        .once('value')
        .then((snapshot) => {
          const data = snapshot.val();
          next(null, data);
        })
        .catch((error) => {
          next(error);
        });
    } catch (error) {
      console.log('getValueAsync: ', path, error);
      next(error);
    }
  };

  getChunksAsync = (path, startAfter, limit, next) => {
    try {
      let instance = this.db.child(path).limitToFirst(limit);
      if (startAfter && startAfter !== 'undefined') {
        instance = this.db.child(path).orderByKey().startAfter(startAfter).limitToFirst(limit);
      }

      instance
        .once('value', (snap) => {
          next(null, snap.val());
        })
        .catch((error) => {
          next(error);
        });
    } catch (error) {
      console.log('getChunksAsync: ', path, error);
      next(error);
    }
  };

  getIndexedValueSync = (path, orderByKey, value) => {
    return new Promise((resolve, reject) => {
      try {
        const ref = this.db.child(path);
        ref
          .orderByChild(orderByKey)
          .equalTo(value)
          .once('value')
          .then((snapshot) => {
            const data = snapshot.val();
            resolve({ error: null, data });
          })
          .catch((error) => {
            resolve({ error });
          });
      } catch (error) {
        reject(error);
      }
    });
  };

  setValueSync = (path, data) => {
    return new Promise((resolve, reject) => {
      try {
        this.db
          .child(path)
          .set(data)
          .then(() => {
            return resolve();
          })
          .catch((error) => {
            return reject(error);
          });
      } catch (error) {
        console.log('setValueSync: ', path, error);
        return reject(error);
      }
    });
  };

  setValueAsync = (path, data, next) => {
    try {
      this.db
        .child(path)
        .set(data)
        .then(() => {
          next();
        })
        .catch((error) => {
          next(error);
        });
    } catch (error) {
      console.log('setValueAsync: ', path, error);
      next(error);
    }
  };

  updateValueAsync = (path, data, next) => {
    try {
      this.db
        .child(path)
        .update(data)
        .then(() => {
          next();
        })
        .catch((error) => {
          next(error);
        });
    } catch (error) {
      console.log('updateValueAsync: ', path, error);
      next(error);
    }
  };

  updateValueSync = (path, data) => {
    return new Promise((resolve, reject) => {
      try {
        this.db
          .child(path)
          .update(data)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      } catch (error) {
        console.log('updateValueSync: ', path, error);
        reject(error);
      }
    });
  };
  deleteValueAsync = (path, next) => {
    try {
      this.db
        .child(path)
        .remove()
        .then(() => {
          next();
        })
        .catch((error) => {
          next(error);
        });
    } catch (error) {
      console.log('deleteValueAsync: ', path, error);
      next(error);
    }
  };
  deleteValueSync = (path) => {
    return new Promise((resolve, reject) => {
      try {
        this.db
          .child(path)
          .remove()
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      } catch (error) {
        console.log('deleteValueSync: ', path, error);
        reject(error);
      }
    });
  };

  push = (path, data, next) => {
    try {
      const pushKey = this.db.push().key;
      const ref = this.db.child(path).child(pushKey);
      ref
        .set(data)
        .then(() => {
          next({ pushKey });
        })
        .catch((e) => {
          next({ error: e });
        });
    } catch (error) {
      console.log('push: ', path, error);
      next({ error: error });
    }
  };

  sendMulticastMessage = (message) => {
    return new Promise((resolve, reject) => {
      this.messagingAdmin
        .sendEachForMulticast(message)
        .then(function (response) {
          return resolve(response);
        })
        .catch(function (error) {
          return reject(error);
        });
    });
  };

  getPushKey = (path) => {
    return new Promise(async (resolve, reject) => {
      try {
        const pushKey = await this.db.child(path).push().key;
        return resolve(pushKey);
      } catch (error) {
        return reject(error);
      }
    });
  };
}

export default Crud;
