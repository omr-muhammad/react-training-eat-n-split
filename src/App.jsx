import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [isFAddOpened, setIsFAddOpened] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friends, setFriends] = useState(initialFriends);

  function toggleAddForm() {
    setIsFAddOpened((pre) => !pre);

    if (selectedFriend) setSelectedFriend(null);
  }

  function handleSelectFriend(frnd) {
    setSelectedFriend((pre) => (pre?.id === frnd.id ? null : frnd));

    if (isFAddOpened) setIsFAddOpened(false);
  }

  function handleBalance(dept, id) {
    setFriends((pre) =>
      pre.map((frnd) =>
        id === frnd.id ? { ...frnd, balance: frnd.balance + dept } : frnd
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          handleSelectFriend={handleSelectFriend}
        />
        {isFAddOpened && (
          <FormAddFriend
            setIsFAddOpened={setIsFAddOpened}
            setFriends={setFriends}
          />
        )}
        <Button onClick={toggleAddForm}>
          {isFAddOpened ? "Close" : "Add friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          handleBalance={handleBalance}
          setSelectedFriend={setSelectedFriend}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, selectedFriend, handleSelectFriend }) {
  return (
    <ul>
      {friends.map((frnd) => (
        <Friend
          key={frnd.id}
          selectedFriend={selectedFriend}
          handleSelectFriend={handleSelectFriend}
          frnd={frnd}
        />
      ))}
    </ul>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function Friend({ frnd, handleSelectFriend, selectedFriend }) {
  const { id, name, image, balance } = frnd;
  return (
    <li>
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <Subtitle balance={balance} name={name} />
      <Button onClick={() => handleSelectFriend(frnd)}>
        {id === selectedFriend?.id ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Subtitle({ balance, name }) {
  if (balance === 0) {
    return <p>You and {name} are even</p>;
  }

  return (
    <>
      {balance > 0 ? (
        <p className="green">
          {name} owes you {balance}
        </p>
      ) : (
        <p className="red">
          You owe {name} {Math.abs(balance)}
        </p>
      )}
    </>
  );
}

function FormAddFriend({ setIsFAddOpened, setFriends }) {
  const [name, setName] = useState("");
  const URL = "https://i.pravatar.cc/48";

  function handleSubmit(e) {
    e.preventDefault();
    if (!name) return;

    const id = crypto.randomUUID();
    const newFreind = {
      id,
      name,
      image: `${URL}?u=${id}`,
      balance: 0,
    };

    setFriends((pre) => pre.concat(newFreind));
    setIsFAddOpened(false);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👬 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼 Image URL</label>
      <input type="text" value={URL} readOnly />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ setSelectedFriend, selectedFriend, handleBalance }) {
  const [billValue, setBillValue] = useState("");
  const [myExpenses, setMyExpenses] = useState("");
  const [casher, setCasher] = useState("user");
  const dept = casher === "user" ? -(billValue - myExpenses) : myExpenses;

  function handleSubmit(e) {
    e.preventDefault();

    if (!billValue || !myExpenses || myExpenses > billValue) return;

    handleBalance(dept, selectedFriend?.id);
    setSelectedFriend(null);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Form Split Bill With {selectedFriend?.name}</h2>

      <label>💰 Bill value</label>
      <input
        type="text"
        value={billValue}
        onChange={(e) => setBillValue(+e.target.value)}
      />

      <label>🕴 Your expense</label>
      <input
        type="text"
        value={myExpenses}
        onChange={(e) => setMyExpenses(+e.target.value)}
      />

      <label>👬 {selectedFriend?.name}'s expense</label>
      <input type="text" value={billValue - myExpenses} disabled />

      <label>🤑 Who is paying the money</label>
      <select value={casher} onChange={(e) => setCasher(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend?.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
