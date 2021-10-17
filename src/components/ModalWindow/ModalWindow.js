import { Modal } from 'antd';
import 'antd/dist/antd.css';

export default function ModalWindow(props) {
    return (
        <Modal
            visible={props.visible}
            onOk={props.modalConfirmDeletion}
            onCancel={props.modalRejectDeletion}
            cancelText="No"
            okText="Yes"
        >
            <p>
                {props.count === 1
                    ? 'Are you sure to delete the message?'
                    : `Are you sure to delete ${props.count} message?`}
            </p>
        </Modal>
    );
}
