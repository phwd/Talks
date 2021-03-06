class: center, middle
<div class="relay-full-screen"><img src="./images/logo.jpg" /></div>
---
class: middle
## agenda
- architecture
- APIs
  - querying
  - mutating
- actors
---
class: middle
<legend>architecture</legend>
## architecture
- react-relay
- relay runtime
  - runtime
  - environment
     - store
     - network
- relay compiler
---
class: center, middle
<legend>architecture</legend>
<img src="./images/architecture.png" class="fuller" />
---
class: center, middle
## relay compiler
---
class: center, middle
<legend>architecture > compiler</legend>
<img src="./images/compiler.png" class="fuller" />
---
class: center, middle
## relay runtime
---
class: middle
<legend>architecture > runtime</legend>
## relay runtime

- sends & caches queries + mutations
- interacts with the network
---
class: center, middle
<legend>architecture > runtime > environment</legend>
<img src="./images/env.png" class="full" />
---
class: middle
<legend>architecture > runtime > environment > store</legend>
## store
- normalized graph store
- garbage collection
- subscriptions
---
class: middle
<legend>architecture > runtime > environment > store</legend>
<div class="columns">
  <div>
    <pre class="language-graphql"><code>
    // Fragment
    fragment A on User {
      id
      name
      address {
        city
      }
    }

    // Response
    {
      id: '842472',
      name: 'Joe',
      address: {
        city: 'Menlo Park',
      }
    }
    </code></pre>
  </div>
  <div>
    <pre class="language-js"><code>
    // Data in store
    {
      '842472': {
        __id: '842472',
        __typename: 'User',
        id: '842472',
        name: 'Joe',
        address: {__ref: 'client:842472:address'},
      },
      'client:842472:address': {
        __id: 'client:842472:address',
        __typename: 'Address',
        city: 'Menlo Park',
      }
    }
    </code></pre>
  </div>
</div>
---
class: middle
<legend>architecture > runtime > environment > store</legend>
<div class="columns">
  <div>
    <pre class="language-graphql"><code>
    // Fragment
    fragment A on User {
      id
      friends {
        edges {
          node {name}
        }
      }
    }

    // Response
    {
      id: '842472',
      friends: {
        edges: [
          {
            node: {
              id: '123',
              name: 'Amy'
            }
          },
          {
            node: {
              id: '456',
              name: 'Beth'
            }
          },
        ]
      }
    }
    </code></pre>
  </div>
  <div>
    <pre class="language-js"><code>
    // Data in store
    {
      '842472': {
        __id: '842472',
        __typename: 'User',
        id: '842472',
        friends: {__ref: 'client:842472:friends'},
      },
      'client:842472:friends': {
        __id: 'client:842472:friends',
        __typename: 'UserToFriendsConnection',
        edges: {
          __refs: [
            'client:842472:friends:edges:0',
            'client:842472:friends:edges:1'
          ]
        }
      },
      'client:842472:friends:edges:0': {
        __id: 'client:842472:friends:edges:0',
        __typename: 'FriendsEdge',
        node: {__ref: '123'}
      },
      '123': {
        __id: '123',
        __typename: 'User',
        id: '123',
        name: 'Amy'
      },
      ...
    }
    </code></pre>
  </div>
</div>
---
class: center, middle
<legend>APIs</legend>
## relay APIs
---
class: center, middle
<legend>APIs > querying</legend>
## query APIs
---
class: middle
<legend>APIs > querying</legend>
## query/fragment APIs
- fetch data
- add it to the right store
- re-render your react tree
---
class: center, middle
<legend>APIs > querying</legend>
<img src="./images/query.png" class="fuller" />
---
class: center, middle
<legend>APIs > querying</legend>
<img src="./images/tree-1.png" class="fuller" />
---
class: center, middle
<legend>APIs > querying</legend>
<img src="./images/tree-2.png" class="fuller" />
---
class: center, middle
<legend>APIs > querying</legend>
<img src="./images/tree-3.png" class="fuller" />
---
class: center, middle
<legend>APIs > querying</legend>
<img src="./images/tree-4.png" class="fuller" />
---
class: center, middle
<legend>APIs > querying</legend>
<img src="./images/tree-5.png" class="fuller" />
---
class: center, middle
<legend>APIs > querying</legend>
<img src="./images/tree-6.png" class="fuller" />
---
<legend>APIs > querying</legend>
```js
// Queries
useLazyLoadQuery(graphql, vars)
usePreloadedQuery(graphql, queryReference)

// Fragments
useFragment(graphql, fragmentReference)
useRefetchableFragment(graphql, fragmentReference)
usePaginationFragment(graphql, fragmentReference)
```
---
<legend>APIs > querying</legend>
```js
// Queries
*useLazyLoadQuery(graphql, vars)
usePreloadedQuery(graphql, queryReference)

// Fragments
*useFragment(graphql, fragmentReference)
useRefetchableFragment(graphql, fragmentReference)
usePaginationFragment(graphql, fragmentReference)

const {group} = useLazyLoadQuery(graphql`
  query Q {
    group(id: $id) {
      ...F
    }
  }
`, {id: '123'})

useFragment(graphql`
  fragment F on Group {
    name
  }
`, group)
```
---
<legend>APIs > querying</legend>
```js
// Queries
*useLazyLoadQuery(graphql, vars)
usePreloadedQuery(graphql, queryReference)

// Fragments
*useFragment(graphql, fragmentReference)
useRefetchableFragment(graphql, fragmentReference)
usePaginationFragment(graphql, fragmentReference)

// Data in store
{
   '123': {
    __id: '123',
    __typename: 'Group',
    id: '123',
    name: 'Cool beanz for teens',
  }
}
```
---
<legend>APIs > querying</legend>
```js
// Queries
useLazyLoadQuery(graphql, vars)
*usePreloadedQuery(graphql, queryReference)

// MyQueryRoot.entrypoint.js
const entrypoint = {
  getPreloadProps: ({actorID, groupID}) => ({
    queries: {
      myQueryReference: {
        environmentProviderOptions: {actorID},
        parameters: require('MyQuery$Parameters'),
        variables: {groupID}
      }
    }
  }),
  root: JSResourceForInteraction('m#MyQueryRoot.react')
}

// MyQueryRoot.react.js
function MyQueryRoot({myQueryReference}) {
  const {group} = usePreloadedQuery(graphql`
    query MyQuery {
      group(id: $id) {
        name
      }
    }
  `, myQueryReference)
}
```
---
<legend>APIs > querying</legend>
```js
// Queries
*useLazyLoadQuery(graphql, vars)
usePreloadedQuery(graphql, queryReference)

// Fragments
useFragment(graphql, fragmentReference)
*useRefetchableFragment(graphql, fragmentReference)
usePaginationFragment(graphql, fragmentReference)

const {group} = useLazyLoadQuery(graphql`
  query Q {
    group(id: $id) {
      ...F
    }
  }
`, {id: '123', order: 'CHRONOLOGICAL'})

const [data, refetch] = useRefetchableFragment(graphql`
  fragment F on Group @refetchable(queryName: "X") {
    group_feed(order: $order) {
      nodes {
        # ...
      }
    }
  }
`, group)

refetch({order: 'TOP_POSTS'})
```
---
<legend>APIs > querying</legend>
```js
// Queries
*useLazyLoadQuery(graphql, vars)
usePreloadedQuery(graphql, queryReference)

// Fragments
useFragment(graphql, fragmentReference)
useRefetchableFragment(graphql, fragmentReference)
*usePaginationFragment(graphql, fragmentReference)

const {group} = useLazyLoadQuery(graphql`
  query Q {
    group(id: $id) {
      ...F
    }
  }
`, {id: '123'})

const {data, hasNext, loadNext} = usePaginationFragment(graphql`
  fragment F on Group @refetchable(queryName: "X") {
    group_feed(first: $count, after: $cursor)
      @connection(key: "X_group_feed") {
      nodes {
        # ...
      }
    }
  }
`, group)

loadNext(4)
```
---
<legend>APIs > querying</legend>
```js
// Queries
*useLazyLoadQuery(graphql, vars)
usePreloadedQuery(graphql, queryReference)

// Fragments
useFragment(graphql, fragmentReference)
useRefetchableFragment(graphql, fragmentReference)
*usePaginationFragment(graphql, fragmentReference)

const {group} = useLazyLoadQuery(graphql`
  query Q {
    group(id: $id) {
      ...F
    }
  }
`, {id: '123'})

const {data, hasNext, loadNext} = usePaginationFragment(graphql`
  fragment F on Group @refetchable(queryName: "X") {
    group_feed(first: $count, after: $cursor)
      @stream_connection(key: "X_group_feed", initial_count: 1) {
      nodes {
        # ...
      }
    }
  }
`, group)

loadNext(4)
```
---
class: center, middle
<legend>APIs > mutating</legend>
## mutation APIs
---
class: middle
<legend>APIs > mutating</legend>
## mutations
- a way to call a Hack function from JS
- write data & fetch new data in one request
- add it to the right store
---
class: center, middle
<legend>APIs > mutating</legend>
<img src="./images/mutation.png" class="fuller" />
---
<legend>APIs > mutating</legend>
```js
commitMutation(environment, config)
enqueueMutation(environment, config)
createUseMutation(graphql, config) // unofficial!
```
---
<legend>APIs > mutating</legend>
```js
*commitMutation(environment, config)
enqueueMutation(environment, config)
createUseMutation(graphql, config)

function useChangeName(
  group_id: FBID,
  name: string,
  onCompleted: ChangeGroupNameResponse => void,
  onError: Error => void
) {
  const environment = useRelayEnvironment()
  commitMutation(environment, {
    mutation: graphql`
      mutation ChangeGroupName($input: ChangeGroupNameData!) {
        change_group_name(data: $input) {
          group {
            name
          }
        }
      }
    `,
    onCompleted,
    onError,
    optimisticResponse, // or, optimisticUpdater
    updater,
    variables: {group_id, name}
  })
}
```
---
<legend>APIs > mutating</legend>
```js
*commitMutation(environment, config)
enqueueMutation(environment, config)
createUseMutation(graphql, config)

// Mutation
commitMutation(environment, {
  mutation: graphql`
    mutation ChangeGroupName($input: ChangeGroupNameData!) {
      change_group_name(data: $input) {
        group {
          name
        }
      }
    }
  `,
  ...
)

// Data in store
{
   '123': {
    __id: '123',
    __typename: 'Group',
    id: '123',
    name: 'New beanz', // Before: 'Cool beanz for teens'
  }
}
```
---
<legend>APIs > mutating</legend>
```js
*commitMutation(environment, config)
enqueueMutation(environment, config)
createUseMutation(graphql, config)

// Mutation
commitMutation(environment, {
  mutation: graphql`
    mutation ChangeGroupName($input: ChangeGroupNameData!) {
      change_group_name(data: $input) {
        group {
          ...GroupMall_group
          ...GroupsTab_group
        }
      }
    }
  `,
  ...
)
```
---
class: middle
<legend>APIs > mutating</legend>
## handling loading states
- **ux principle**: always show that something happened
  - eg. optimistic update
  - eg. disable the button that triggered it
  - eg. show a glimmer
---
class: middle
<legend>APIs > mutating</legend>
## handling responses
- **ux principle**: tell people when something succeeded/failed; stronger intent -> stronger affordance
  - eg. update ui
  - eg. update ui + confirmation toast <img src="./images/success.png" width="300px" />
  - eg. update ui + confirmation toast w/ Undo <img src="./images/success-undo.png" width="300px" />
---
class: middle
<legend>APIs > mutating</legend>
## handling errors
- `onCompleted(data, errors)`
- `onError(error)`
- **ux principle**: give people a way to recover
  - eg. error toast w/ Try Again <img src="./images/error.png" width="300px" style="margin-bottom:-25px" />
- No need to log errors. Already in [Scuba > GraphQL Exceptions](https://our.intern.facebook.com/intern/scuba/query?dataset=graphql_exception)
---
<legend>APIs > mutating</legend>
```js
*commitMutation(environment, config)
enqueueMutation(environment, config)
createUseMutation(graphql, config)

// Mutation
commitMutation(environment, {
  mutation: graphql`
    mutation ChangeGroupName($input: ChangeGroupNameData!) {
      change_group_name(data: $input) {
        group {
          name
        }
      }
    }
  `,
  optimisticResponse: {
    change_group_name: {
      group: {
        name: 'New beanz'
      }
    }
  }
)
```
---
<legend>APIs > mutating</legend>
```js
*commitMutation(environment, config)
enqueueMutation(environment, config)
createUseMutation(graphql, config)

// Mutation
commitMutation(environment, {
  mutation: graphql`
    mutation ChangeGroupName($input: ChangeGroupNameData!) {
      change_group_name(data: $input) {
        group {
          name
        }
      }
    }
  `,
  optimisticUpdater(store) {
    const group = store.get(groupID)
    group.setValue('New beanz', 'name')
  }
)
```
---
class: middle
<legend>APIs > mutating</legend>

## optimistic updates

- prefer them > loading states
- prefer `optimisticResponse` > `optimisticUpdater`
- use them when the mutation is:
  - not critical
  - predictable
  - reliable
---
<legend>APIs > mutating</legend>
```js
commitMutation(environment, config)
*enqueueMutation(environment, config)
createUseMutation(graphql, config)

function useChangeName(
  group_id: FBID,
  name: string,
  onCompleted: ChangeGroupNameResponse => void,
  onError: Error => void
) {
  const environment = useRelayEnvironment()
  enqueueMutation(environment, {
    mutation: graphql`
      mutation ChangeGroupName($input: ChangeGroupNameData!) {
        change_group_name(data: $input) {
          group {
            name
          }
        }
      }
    `,
    onCompleted,
    onError,
    optimisticResponse, // or, optimisticUpdater
    variables: {group_id, name}
  })
}
```
---
<legend>APIs > mutating</legend>
```js
*commitMutation(environment, config)
enqueueMutation(environment, config)
createUseMutation(graphql, config)
```
<video src="./images/queue-before.mov" class="video" autoplay controls loop />
---
<legend>APIs > mutating</legend>
```js
*commitMutation(environment, config)
enqueueMutation(environment, config)
createUseMutation(graphql, config)
```
<img src="./images/waterfall-good.png" class="video" />
---
<legend>APIs > mutating</legend>
```js
*commitMutation(environment, config)
enqueueMutation(environment, config)
createUseMutation(graphql, config)
```

| action | UI state | optimistic stack |
| ---|--|--|
| (start) | <img src="./images/join-button.png" style="margin-bottom: -11px; width:200px" /> | `[]`
| **click Join** | <img src="./images/leave-button.png" style="margin-bottom: -11px; width:200px" /> | `[JOIN]`
| (Join returns) | <img src="./images/leave-button.png" style="margin-bottom: -11px; width:200px" /> | `[]`
| **click Cancel** | <img src="./images/join-button.png" style="margin-bottom: -11px; width:200px" /> | `[CANCEL]`
| (Cancel returns) | <img src="./images/join-button.png" style="margin-bottom: -11px; width:200px" /> | `[]`

<img src="./images/waterfall-good.png" style="display: block; margin: 20px auto; width: 330px;" />
---
<legend>APIs > mutating</legend>
```js
*commitMutation(environment, config)
enqueueMutation(environment, config)
createUseMutation(graphql, config)
```
<img src="./images/waterfall-bad.png" class="video" />
---
<legend>APIs > mutating</legend>
```js
*commitMutation(environment, config)
enqueueMutation(environment, config)
createUseMutation(graphql, config)
```

| action | UI state | optimistic stack |
| ---|--|--|
| (start) | <img src="./images/join-button.png" style="margin-bottom: -11px; width:200px" /> | `[]`
| **click Join** | <img src="./images/leave-button.png" style="margin-bottom: -11px; width:200px" /> | `[JOIN]`
| **click Cancel** | <img src="./images/join-button.png" style="margin-bottom: -11px; width:200px" /> | `[JOIN, CANCEL]`
| (Cancel returns) | <img src="./images/leave-button.png" style="margin-bottom: -11px; width:200px" /> | `[JOIN]`
| (Join returns) | <img src="./images/leave-button.png" style="margin-bottom: -11px; width:200px" /> | `[]`

<img src="./images/waterfall-bad.png" style="display: block; margin: 20px auto; width: 330px;" />
---
<legend>APIs > mutating</legend>
```js
commitMutation(environment, config)
*enqueueMutation(environment, config)
createUseMutation(graphql, config)
```

| action | UI state | optimistic stack | network queue |
| ---|--|--|--|
| (start) | <img src="./images/join-button.png" style="margin-bottom: -11px; width:200px" /> | `[]` | `[]`
| **click Join** | <img src="./images/leave-button.png" style="margin-bottom: -11px; width:200px" /> | `[JOIN]` | `[]`
| **click Cancel** | <img src="./images/join-button.png" style="margin-bottom: -11px; width:200px" /> | `[JOIN, CANCEL]` | `[CANCEL]`
| (Join returns) | <img src="./images/join-button.png" style="margin-bottom: -11px; width:200px" /> | `[CANCEL]` | `[]`
| (Cancel returns) | <img src="./images/join-button.png" style="margin-bottom: -11px; width:200px" /> | `[]` | `[]`
---
<legend>APIs > mutating</legend>
```js
commitMutation(environment, config)
*enqueueMutation(environment, config)
createUseMutation(graphql, config)
```

<div class="columns">
  <div class="column">
  <h4><code>commitMutation</code></h4>
  <video src="./images/queue-before.mov" class="small-video" autoplay controls loop />
  </div>
  <div class="column">
  <h4><code>enqueueMutation</code></h4>
  <video src="./images/queue-after.mov" class="small-video" autoplay controls loop />
  </div>
</div>
---
<legend>APIs > mutating</legend>
```js
commitMutation(environment, config)
enqueueMutation(environment, config)
*createUseMutation(graphql, config)

// Mutation
const useChangeGroupName = createUseMutation(
  graphql`
    mutation ChangeGroupName($input: ChangeGroupNameData!) {
      change_group_name(data: $input) {
        group {name}
      }
    }
  `,
  input => ({
    change_group_name: {
      group: {
        name: input.name
      }
    }
  })
)

// In a React component...
const changeGroupName = useChangeGroupName()

changeGroupName({group_id: '123', name: 'New beanz'})
  .then(response => { /* success */ })
  .catch(error => { /* error */ })
```
---
class: middle
<legend>APIs > mutating</legend>
## `createUseMutation`
- Porcelain for `enqueueMutation`
- `Promise`-based API
- Environment-aware
- More intuitive success/error callbacks
---
class: center, middle
## actors
---
class: middle
<legend>actors</legend>
## definitions
- **account**: who you're logged in as
- **user** (or, "actor"): who you're acting as

<small>*41 kinds of actors at time of writing</small>
---
class: center, middle
<legend>actors</legend>
<img src="./images/actor-0.png" class="fuller" style="top: 40px" />
---
class: center, middle
<legend>actors</legend>
<img src="./images/actor-1.png" class="fuller" style="top: 40px" />
---
class: center, middle
<legend>actors</legend>
<img src="./images/actor-2.png" class="fuller" style="top: 40px" />
---
class: center, middle
<legend>actors</legend>
<img src="./images/env.png" class="full" />
---
class: center, middle
<legend>actors</legend>
<img src="./images/envs.png" class="full" />
---
class: middle
<legend>actors</legend>
```js
<ActorProvider initialActorID="123" readonly={true}>
  <TopBar />                                              // actor = 123
  <GroupMall>                                             // actor = 123
    <ActorProvider initialActorID="456" readonly={true}>  // actor = 123
      <GroupMallFeed />                                   // actor = 456
    </ActorProvider>
  </GroupMall>
</ActorProvider>
```
---
class: center, middle
<legend>actors</legend>
<img src="./images/av.png" class="fuller" />
---
class: middle
<legend>actors</legend>
## getting the current actor
```js
const [actorID] = useActor()

// or
{
  viewer {
    actor {
      id
    }
  }
}
```
---
class: middle
<legend>actors</legend>
## setting the current actor
```js
<ActorProvider initialActorID="123" scope="456">
  <MyComponent />
</ActorProvider>

// MyComponent.react.js
const [actorID, setActorID] = useActor()
setActorID('789')
```
---
class: middle
<legend>actors</legend>
## actors
- many actors per page
- set automatically on all GraphQL reads/writes
- totally sandboxed data
---
class: center, middle
## thanks!
---
class: middle
## learn more:

- fburl.com/guided-tour-of-relay
- fburl.com/relay-api
- fburl.com/actors-on-comet
