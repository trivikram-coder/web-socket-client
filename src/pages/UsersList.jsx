import React from 'react'

const UsersList = ({users}) => {
  return (
    <div>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.userName}</li>
        ))}
      </ul>
    </div>
  )
}

export default UsersList
