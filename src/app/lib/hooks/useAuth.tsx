// import Cookies from 'js-cookie'
// import { useAppDispatch, useAppSelector } from '../redux/hook'
// import { selectUser, setUser } from '../redux/auth/authSlice'

// export const useAuth = function () {
//   const dispatch = useAppDispatch()
//   const token: string | undefined = Cookies.get('access_token')
//   let currentUser: User | null | undefined = useAppSelector(selectUser)

//   function cookieRemoveAuthInfo() {
//     Cookies.remove('access_token')
//     Cookies.remove('refresh_token')
//     dispatch(setUser(null))
//   }

//   async function getUser(token: string) {
//     try {
//       const respFetchUser = await factories.user.getUser(token)
//       const user: User = respFetchUser?.data
//       dispatch(setUser(user))
//       return user
//     } catch (error: any) {
//       cookieRemoveAuthInfo()
//       // TODO : show toast message
//       // TODO : redirect to login page
//     }
//   }

//   async function login() {
//     if (formData) {
//       const response = await factories.auth.login({
//         username: formData.username,
//         password: formData.password
//       })
//       if (response?.status === 200 || response?.status === 201) {
//         const token = response?.data?.access_token
//         const refreshToken = response?.data?.refresh_token
//         setCookie('access_token', token)
//         setCookie('refresh_token', refreshToken)

//         commonInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`

//         await getUser(token)
//         navigate(redirectPage)
//       } else {
//         // TODO : show toast error
//       }
//     }
//   }

//   function logout() {
//     // TODO : Call API logout
//     cookieRemoveAuthInfo()
//     navigate('/login')
//   }

//   return {
//     token,
//     currentUser,
//     getUser,
//     login,
//     logout
//   }
// }
