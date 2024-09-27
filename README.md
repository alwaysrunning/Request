## 快速上手
```typescript

const [{data, loading, error }, Fetch] = useRequest(
    {
      url: 'https://reqres.in/api/users',
    },
    {
      manual: true,
      autoCancel: false,
    }
  )
```