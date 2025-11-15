export function UserList({ users }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-64">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Online Users ({users.length})
      </h3>

      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.user_id}
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: user.user_color }}
            />
            <span className="text-sm text-gray-700 flex-1">{user.user_name}</span>

            {user.is_drawing && (
              <span className="text-xs text-gray-500">drawing...</span>
            )}
          </div>
        ))}

        {users.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No other users online
          </p>
        )}
      </div>
    </div>
  );
}
