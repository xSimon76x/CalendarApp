import { useState } from "react";
import Modal from "react-modal"

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');

export const CalendarModal = () => {

    const [isModalOpen, setIsModalOpen] = useState(true)

    const onCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Modal
            isOpen={isModalOpen}
            // onAfterOpen={afterOpenModal}
            onRequestClose={onCloseModal}
            style={customStyles}
            // contentLabel="Example Modal"
            className="modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={ 200 }
        >
            <h1>Hola mundo</h1>
            <hr />
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus nihil amet quas ipsum, reiciendis assumenda sapiente corrupti sunt consequatur molestiae quae, sint soluta corporis deleniti officiis nam voluptates ipsam quisquam.</p>
        </Modal>
    )
}
