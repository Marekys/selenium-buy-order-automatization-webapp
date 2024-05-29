import React from "react"
import "./itemsTable.css"
import { useAuth } from "../../loginComponents/authContext.jsx"
import { X, Loader, Circle, Check } from 'react-feather';

const ItemsList = ({ items, updateItem, updateCallback }) => {
    const { user } = useAuth();

    const onDelete = async (id) => {
        try {

            const options = {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            }
            const response = await fetch(`http://127.0.0.1:5000/delete_item/${id}`, options)
            if (response.status === 200) {
                updateCallback()
            } else {
                console.error("Failed to delete item")
            }
        } catch (error) {
            alert(error)
        }
    }

    const parseUrlText = (url) => {
        const textAfterLastSlash = url.substring(url.lastIndexOf('/') + 1);
    
        const parsedText = textAfterLastSlash.replace(/%20/g, ' ');
    
        return parsedText;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Status.INCORRECT_URL':
                return <X />;
            case 'Status.PENDING':
                return <Circle/>;
            case 'Status.IN_PROGRESS':
                return <Loader />;
            case 'Status.COMPLETED':
                return <Check />;
            default:
                return null;
        }
    };
    
    return <div>
        <table>
            <thead>
                <tr>
                    <th>Item ID</th>
                    <th className="url-style">Url</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td className="url-style">{parseUrlText(item.itemUrl)}</td>
                        <td>{item.itemPrice}</td>
                        <td>{item.itemQuantity}</td>
                        <td>{getStatusIcon(item.status)}</td>
                        <div className="item-buttons">
                            <button className="edit-item-button" onClick={() => updateItem(item)}>Edit</button>
                            <button className="delete-item-button" onClick={() => onDelete(item.id)}>Delete</button>
                        </div>
                    </tr>
            ))}
            </tbody>
        </table>
    </div>
    }

    export default ItemsList