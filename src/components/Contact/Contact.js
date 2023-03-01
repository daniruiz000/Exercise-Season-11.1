import './Contact.css';
import React from 'react';

const Contact = (props) => {

  return (
    <div className="contact-item" key={props.contact.id}>
      <img className="contact-item__image" src={props.contact.imageUrl} alt={"Imagen de " + props.contact.name} />
      <div className="contact-item__info">
        <p className="contact-item__name">{props.contact.name} {props.contact.lastName}</p>
        <p className="contact-item__ammount">{props.contact.phone}</p>
        <button className="contact-item__delete-button" onClick={() => props.deleteItem(props.contact)}>ELIMINAR</button>
      </div>
    </div>
  );
}

const ContactMemo = React.memo(Contact);

export default ContactMemo;