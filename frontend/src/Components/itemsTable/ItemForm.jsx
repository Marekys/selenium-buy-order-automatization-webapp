import { useState } from "react";
import { useAuth } from '../../Components/login/authContext.jsx'; // Adjust the import according to your file structure
import "../../Components/login/loginModal.css"
import "../../index.css"
import "../homePage/homeTab.css"

const ItemForm = ({ existingItem = {}, updateCallback }) => {
    const { user } = useAuth();
    const [itemUrl, setUrl] = useState(existingItem.itemUrl || '');
    const [itemPrice, setPrice] = useState(existingItem.itemPrice || '');
    const [itemQuantity, setQuantity] = useState(existingItem.itemQuantity || '');

    const updating = Object.entries(existingItem).length !== 0;

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("User is not authenticated!");
            return;
        }

        const data = {
            itemUrl,
            itemPrice,
            itemQuantity,
            user_id: user.id
        };

        const webUrl = "http://127.0.0.1:5000/" + (updating ? `update_item/${existingItem.id}` : `create_item`);
        const options = {
            method: updating ? "PATCH" : "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify(data)
        };

        const response = await fetch(webUrl, options);
        if (response.status === 201 || response.status === 200) {
            updateCallback();
        } else {
            const data = await response.json();
            alert(data.message);
        }
    };

    return (
        <form onSubmit={onSubmit} className='form-style'>
            <div>
                <label htmlFor="itemUrl">Items Url:</label>
                <input 
                    type="text" 
                    id="itemUrl"
                    value={itemUrl} 
                    onChange={(e) => setUrl(e.target.value)} 
                />
            </div>
            <div>
                <label htmlFor="itemPrice">Price:</label>
                <input
                    type="number"
                    min="0.03"
                    step="0.01"
                    id="itemPrice"
                    value={itemPrice}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="itemQuantity">Quantity:</label>
                <input
                    type="number"
                    id="itemQuantity"
                    value={itemQuantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
            </div>
            <button className= "start-button">{updating ? "Update" : "Add"}</button>
        </form>
    );
};

export default ItemForm;
