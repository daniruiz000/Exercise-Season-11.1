import './ContactList.css';
import React from 'react';
import ContactMemo from '../Contact/Contact';
import { useDebounce } from 'use-debounce';

const ContactList = React.memo(() => {

    const API_URL = "http://localhost:4000/contacts";

    const [contactList, setContactList] = React.useState([]);
    const [newContact, setNewContact] = React.useState({ name: "", lastName: "", phone: "" });
    const [actualContact, setActualContact] = React.useState();
    const [search, setSearch] = React.useState("");
    const [searchDebounce] = useDebounce(search,1000);

    React.useEffect(() => {
        getAllContactsFromApi();
    }, []);

    React.useEffect(() => {
        findContact(searchDebounce);
    }, [searchDebounce]);

    const findContact = React.useCallback((event) => {
        event &&
            fetch(`${API_URL}?q=${event}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data[0])
                    setActualContact(data[0])
                    setSearch("")
                })
         
    }, [setActualContact])

    const getAllContactsFromApi = () => {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => setContactList(data));

    }

    const deleteContact = React.useCallback((contact) => {
        fetch(`${API_URL}/${contact.id}`, {
            method: "DELETE"
        })
            .then(response => response.json())
            .then(() => getAllContactsFromApi());
    }, []);

    const addNewContact = (event) => {
        event.preventDefault();


        fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(newContact),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(() => {
                getAllContactsFromApi();
                setNewContact({
                    name: "",
                    lastName: "",
                    phone: ""
                });
            });
    }

    return (
        <div className="contact-list">
            <h2>Mi Agenda ({contactList.length}): </h2>
            {contactList.map(contact =>
                <ContactMemo
                    key={contact.id}
                    contact={contact}
                    deleteItem={deleteContact}
                ></ContactMemo>)}

            <h2>Buscar</h2>
            <form onSubmit={(event) => findContact(event)}>
                <p>
                    <label>Buscar: </label>
                    <input type="text" name="search" id="search" value={search} onChange={(event) => { setSearch(event.target.value) }}></input>
                </p>
            </form>
            {actualContact &&
                <div className="contact-item" key={actualContact.id}>
                    <img className="contact-item__image" src={actualContact.imageUrl} alt={"Imagen de " + actualContact.name} />
                    <div className="contact-item__info">
                        <p className="contact-item__name">{actualContact.name} {actualContact.lastName}</p>
                        <p className="contact-item__ammount">{actualContact.phone}</p>
                        <button className="contact-item__delete-button" onClick={() => setActualContact()}>ELIMINAR</button>
                    </div>
                </div>
            }
            {search.length > 0 && <p>No hay resultados</p>}

            <h2>Añadir nuevo contacto</h2>
            <form onSubmit={(event) => addNewContact(event)}>
                <p>
                    <label>Nombre : </label>
                    <input type="text" name="name" id="name" value={newContact.name} onChange={(event) => setNewContact({
                        ...newContact,
                        name: event.target.value,
                    })} />
                </p>
                <p>
                    <label>Apellidos: </label>
                    <input type="text" name="lastName" id="lastName" value={newContact.lastName} onChange={(event) => setNewContact({
                        ...newContact,
                        lastName: event.target.value,
                    })} />
                </p>
                <p>
                    <label>URL de la imagen: </label>
                    <input type="text" name="imageUrl" id="imageUrl" value={newContact.imageUrl} onChange={(event) => setNewContact({
                        ...newContact,
                        imageUrl: event.target.value,
                    })} />
                </p>
                <p>
                    <label>Teléfono: </label>
                    <input type="text" name="phone" id="phone" value={newContact.phone} onChange={(event) => setNewContact({
                        ...newContact,
                        phone: event.target.value,
                    })} />
                </p>

                <button type="submit">Añadir contacto</button>

            </form>
        </div>
    );

});
export default ContactList;