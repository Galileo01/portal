import instance from './index'

export const testPing = () =>
  instance.get('/test/ping', {
    params: {
      name: '666',
      age: 18,
    },
  })

export default testPing
