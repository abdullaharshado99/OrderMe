# API Implementation with @tanstack/react-query

## ✅ Setup Complete!

Your new optimized API structure is ready to use alongside your existing implementation.

## 📁 New Structure Created

```
src/services/api/
├── client/
│   └── axiosInstance.js          # Auto token injection + 401 handling
├── config/
│   └── queryKeys.js              # Centralized cache keys
├── services/
│   ├── authService.js            # Auth API calls
│   ├── notificationService.js    # Notification API calls
│   ├── wantlystService.js        # Wantlyst API calls
│   ├── friendService.js          # Friend API calls
│   ├── eventService.js           # Event API calls
│   ├── externalProductService.js # Product scraping API calls
│   └── sizeChartService.js       # Size chart API calls
└── hooks/
    ├── queries/
    │   ├── useAuthQueries.js
    │   ├── useNotificationQueries.js
    │   ├── useWantlystQueries.js
    │   ├── useFriendQueries.js
    │   ├── useEventQueries.js
    │   └── useSizeChartQueries.js
    └── mutations/
        ├── useAuthMutations.js
        ├── useNotificationMutations.js
        ├── useWantlystMutations.js
        ├── useFriendMutations.js
        ├── useEventMutations.js
        └── useExternalProductMutations.js
```

## 🚀 How to Use

### Old Way (Still Works)
```javascript
import queryHandler from '../../services/queries/queryHandler';
import { mutationHandler } from '../../services/mutations/mutationHandler';

const { data } = queryHandler(EndPoints.getNotifications, true);
const { mutate } = mutationHandler(url, token, onSuccess, onError);
```

### New Way (Recommended)
```javascript
import { useNotifications } from '../../services/api/hooks/queries/useNotificationQueries';
import { useMarkNotificationAsRead } from '../../services/api/hooks/mutations/useNotificationMutations';

// Query
const { data, isLoading, error, refetch } = useNotifications();

// Mutation
const { mutate: markAsRead, isPending } = useMarkNotificationAsRead();
markAsRead(notificationId, {
  onSuccess: () => console.log('Success'),
  onError: (err) => console.error(err)
});
```

## 📖 Usage Examples

### Authentication
```javascript
import { useLogin, useSignup } from '../../services/api/hooks/mutations/useAuthMutations';
import { useProfile } from '../../services/api/hooks/queries/useAuthQueries';

// Login
const { mutate: login, isPending } = useLogin();
login({ email, password }, {
  onSuccess: (data) => {
    dispatch(dispatchUser(data));
    navigation.navigate('Home');
  }
});

// Get Profile
const { data: profile, isLoading } = useProfile();
```

### Notifications
```javascript
import { useNotifications, useInfiniteNotifications } from '../../services/api/hooks/queries/useNotificationQueries';
import { useMarkNotificationAsRead } from '../../services/api/hooks/mutations/useNotificationMutations';

// Get all notifications
const { data, refetch } = useNotifications();

// Infinite scroll
const { data, fetchNextPage, hasNextPage } = useInfiniteNotifications();

// Mark as read
const { mutate: markAsRead } = useMarkNotificationAsRead();
markAsRead(notificationId);
```

### Wantlysts
```javascript
import { useWantlysts, useWantlyst } from '../../services/api/hooks/queries/useWantlystQueries';
import { useCreateWantlyst, useUpdateWantlyst } from '../../services/api/hooks/mutations/useWantlystMutations';

// Get all wantlysts
const { data: wantlysts } = useWantlysts();

// Get specific wantlyst
const { data: wantlyst } = useWantlyst(wantlystId);

// Create wantlyst
const { mutate: createWantlyst } = useCreateWantlyst();
createWantlyst({ name: 'My List', description: 'Cool items' });

// Update wantlyst
const { mutate: updateWantlyst } = useUpdateWantlyst();
updateWantlyst({ wantlystId: '123', updateData: { name: 'New Name' } });
```

### Friends
```javascript
import { useFriends, useFriendRequests } from '../../services/api/hooks/queries/useFriendQueries';
import { useSendFriendRequest, useAcceptFriendRequest } from '../../services/api/hooks/mutations/useFriendMutations';

// Get friends
const { data: friends } = useFriends();

// Get requests
const { data: requests } = useFriendRequests();

// Send request
const { mutate: sendRequest } = useSendFriendRequest();
sendRequest({ receiverId: 'user123' });

// Accept request
const { mutate: acceptRequest } = useAcceptFriendRequest();
acceptRequest({ requestId: 'req123' });
```

## 🎯 Key Benefits

1. **Auto Token Management** - No more passing tokens manually
2. **Global Error Handling** - 401 errors handled automatically
3. **Optimistic Updates** - UI updates before API response
4. **Cache Invalidation** - Smart cache updates after mutations
5. **Type Safety** - Ready for TypeScript
6. **Better Testing** - Mock services easily
7. **Cleaner Code** - Less boilerplate

## ⚡ Performance Features

- **Stale Time**: Data stays fresh for 5 minutes
- **Cache Time**: Data cached for 10 minutes
- **Auto Retry**: Failed requests retry up to 2 times
- **Optimistic Updates**: Instant UI feedback
- **Infinite Queries**: Built-in pagination support
- **Refetch Intervals**: Real-time updates for notifications

## 🔄 Migration Steps

1. ✅ **Core setup complete** (QueryClient, axiosInstance, queryKeys)
2. Pick one screen to migrate (e.g., NotificationScreen)
3. Replace old handlers with new hooks
4. Test thoroughly
5. Repeat for other screens
6. Remove old handlers when done

## 📚 Resources

- React Query Docs: https://tanstack.com/query/latest
- Your old handlers still work - migrate gradually!

## ⚠️ Important Notes

- **Both systems coexist** - Old code keeps working
- **No breaking changes** - Migrate at your own pace
- **QueryClient fixed** - Cache now persists correctly
- **Token auto-injected** - No manual token passing needed
- **401 handled globally** - Auto logout on token expiration

## 🎉 You're Ready!

Start using the new hooks in your components. All services, hooks, and configurations are production-ready!
