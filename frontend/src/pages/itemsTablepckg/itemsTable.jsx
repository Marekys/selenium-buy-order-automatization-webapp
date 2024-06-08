import { useState, useEffect } from 'react';
import '../../App.css';
import ItemsList from './ItemsList';
import ItemForm from './ItemForm';
import "../../index.css";
import "./itemsTable.css";
import RunBOs from '../runBuyOrders/RunBOs';
import { useAuth } from '../../loginComponents/authContext.jsx';
import "../../loginComponents/loginModal.css"


function ItemsTable( { refreshItemsTable }) {
  const [items, setItems] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState({})
  const { user } = useAuth();
  
  useEffect(() => {
      if (user) {
          fetchItems();
      }
  }, [user, refreshItemsTable]);

  const fetchItems = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/items', {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      const data = await response.json();
      setItems(data.items);
  };


  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentItem({})
  }

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)
  }

  const openEditModal = (item) => {
    if (isModalOpen) return
    setCurrentItem(item)
    setIsModalOpen(true)
  }

  const onUpdate = () => {
    closeModal();
    fetchItems();
  }

  return (
    <div className='main-section-holder'>
      <div className='main-section-style-items'>
        <div className='items-table'>
          <div className='items-table-header'> Items</div>
          <div className='items-table-buttons'>
            <button className="create-item-button" onClick={openCreateModal}>Create New Item</button>
            {
              isModalOpen && 
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={closeModal}>&times;</span>
                  <ItemForm userId={user?.id} existingItem={currentItem} updateCallback={onUpdate}/>
                </div>
              </div>
            }
            <RunBOs updateCallback={onUpdate} userId={user?.id}></RunBOs>
          </div>
        </div>
        <ItemsList userId={user?.id} items={items} updateItem={openEditModal} updateCallback={onUpdate}/>
      </div>
    </div>
  )
  
}

export default ItemsTable
