export const EndPoints = {
  getMessages: "/messages/",
  getThreadsById: (threadId) => `/messages/thread/${threadId}`,
  signup: "/auth/signup",
  login: "/auth/login",
  forgotPassword: "/auth/forgotPassword",
  verifyLoginOtp: "/auth/verify-otp",
  /** Same route; body uses purpose: 'signup' */
  verifySignupOtp: "/auth/verify-otp",
  ConnectGmailAccount: "/integrations/google/auth-url",
  getUserProfile: "/users/profile",
  getMessagesInsights: "/messages/insights/",
  sendMessage: "/messages/reply/",
  createTask: "/tasks",
  getTasks: "/tasks",
  getAiTasks: "/tasks/ai-suggestions",
  editProfile: "/users/profile",
  // login: '/auth/login',
  // forgotPassword: '/auth/forgot-password',
  // resendOTP: '/auth/resend-otp',
  // verifyOTP: '/auth/verify-otp',
  // resetPassword: '/auth/reset-password',
  // GoogleLogin: "/auth/login",

  // //profileAPIs
  // getUserProile: "/auth/profile",
  // editProfile: "/auth/edit-profile",
  // updateName: "/auth/update-name",
  // personalInformation: "/auth/personal-information",
  // jewelryPreferences: "/auth/jewelry",
  // interestsInformation: "/auth/interests",
  // interests: "/auth/interests",
  // brandsInformation: "/auth/brands",
  // sizesInformation: "/auth/sizes",
  // fcmTokenSave: "/auth/store-fcm-token",
  // logout: "/auth/logout",

  // //refreshToken
  // refreshToken: "/auth/refresh-token",

  // //sizeChartApi
  // getSizeChart: "/size-chart",

  // //shareProductsShow with scraping
  // externalProductScrape: "/external-product/scrape",
  // externalProductStoreInWantLyst: "/external-product/store",
  // externalProductShow: "/external-product",
  // externalProductShowById: "/external-product/{id}",

  // // firend Request APi
  // frientRequestSend: "/friends/requests/send",
  // frientRequestCancel: "/friends/requests/cancel",
  // allFriendRequest: "/friends/requests",
  // frientRequestDecline: "/friends/requests/decline",
  // frientRequestAccept: "/friends/requests/accept",
  // getFriends: "/friends",
  // deleteFriend: "/friends/{friendId}", //pending
  // getOtherUserOverview: "/auth/friend-overview/{friendId}",

  // //Notifications
  // getNotifications: "/notifications",
  // readNotification: (id) => `/notifications/${id}/read`,
  // // readNotification:"/notifications/{id}/read",

  // // wantlystApis
  // createWantLyst: "/wantlyst",
  // getWantLyst: "/wantlyst",
  // updateWantLyst: (id) => `/wantlyst/${id}`,

  // //Events Apis
  // createEvents: "/events",
  // getEvents: "/events",

  // // List APIs (unified for both wantlysts and events)
  // createList: "/list",
  // getList: "/list", // Supports ?listType=wantlyst or ?listType=my_event
  // getListById: (id) => `/list/${id}`,
  // updateList: (id) => `/list/${id}`,
  // deleteList: (id) => `/list/${id}`,
  // getListItems: (id) => `/list/${id}/items`,
  // addListItem: (id) => `/list/${id}/items`,
  // inviteToList: (id) => `/list/${id}/invite`,
  // respondToInvite: (id) => `/list/${id}/respond`,
  // getListMembers: (id) => `/list/${id}/members`,
  // removeListMember: (id, userId) => `/list/${id}/members/${userId}`,

  // //Discovery API
  // getDiscovery: "/discovery",
  // getItemComments: (itemId) => `/item/${itemId}/comments`,
  // addComment: (itemId) => `/item/${itemId}/comment`,
  // likeComment: (itemId, commentId) => `/item/${itemId}/comment/${commentId}/like`,

  // ///////////////////////////// profile creation API.

  // personalProfile: "/auth/personal-profile",
};
