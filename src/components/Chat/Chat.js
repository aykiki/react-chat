import './Chat.module.scss';
import styles from './Chat.module.scss';
import Sender from '../Sender/Sender';
import {
    $messages,
    insertion,
    addition,
    replacement,
} from '../../store/messages';
import ChatHistory from '../ChatHistory/ChatHistory';
import ModalWindow from '../ModalWindow/ModalWindow';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { getDateStringFromDateObject } from '../../lib/getDateStringFromDateObject';
import { getTimeStringFromDateObject } from '../../lib/getTimeStringFromDateObject';
import { useStore } from 'effector-react';

const { log } = console;

export const selectionMode = {
    stop: 'stop',
    reply: 'reply',
    both: 'both',
    nothing: 'nothing',
};

export default function Chat() {
    // the global states
    const messages = useStore($messages);
    const uniqID = useRef(-1);

    // for editing
    const [isEditFirst, setEditFirst] = useState({
        value: false,
        message: {},
    });
    const [isEditSecond, setEditSecond] = useState({
        value: false,
        message: {},
    });

    // the modal's state for deletion messages
    const [isShowModal, setModal] = useState({
        value: false,
        messages: [],
    });

    // scroll to bottom
    const chatRef = useRef();

    // selected messages and mode for management
    const [selectedMessageModeFirst, setSelectedMessagesModeFirst] = useState(
        selectionMode.nothing
    );
    const [selectedMessageModeSecond, setSelectedMessagesModeSecond] = useState(
        selectionMode.nothing
    );
    const [selectedMessages, setSelectedMessages] = useState([]);

    //global useEffects

    // reload local storage if messages state has been changed
    // add to loсal storage if new message has been added
    useEffect(() => {
        localStorage.setItem('messages', JSON.stringify(messages));
    }, [messages]);

    // update uniqID everytime when mounting
    useEffect(() => {
        // on component init find out a biggest ID number of stored messages
        uniqID.current = (
            JSON.parse(localStorage.getItem('messages')) || []
        ).reduce((acc, value) => {
            return acc < value.id ? value.id : acc;
        }, -1);
    }, []);

    // for scroll to bottom when sending messages
    useLayoutEffect(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [messages.length]);

    //to remove selection during mounting
    useEffect(() => {
        messages.forEach((value) => changeSelectedStatus(value, false));
    }, []);

    // useEffects for editing, deletion, and references

    // to change selection mode for showing modals
    useEffect(() => {
        if (selectedMessages.length) {
            if (
                selectedMessages.every(
                    (item, _, array) => item.author === array[0].author
                )
            ) {
                if (selectedMessages[0].author === 'firstSender') {
                    setSelectedMessagesModeFirst(selectionMode.both);
                    setSelectedMessagesModeSecond(selectionMode.reply);
                } else {
                    setSelectedMessagesModeSecond(selectionMode.both);
                    setSelectedMessagesModeFirst(selectionMode.reply);
                }
            } else {
                setSelectedMessagesModeFirst(selectionMode.reply);
                setSelectedMessagesModeSecond(selectionMode.reply);
            }
        }
    }, [selectedMessages]);

    useEffect(() => {
        if (!selectedMessages.length) {
            setSelectedMessagesModeSecond('nothing');
            setSelectedMessagesModeFirst('nothing');
        }
    }, [selectedMessages]);

    useEffect(() => {
        if (!selectedMessages.length) {
            messages.forEach((value) => changeSelectedStatus(value, false));
        }
    }, [selectedMessages]);

    // function for easement
    const getMessageObject = (messageID) => {
        return messages.find((value) => value.id === messageID);
    };

    //handles

    // put message to messages state (from sender component)
    const sendMessage = (text, author, isReplying) => {
        const message = {
            id: ++uniqID.current,
            author: author,
            date: getDateStringFromDateObject(new Date()),
            time: getTimeStringFromDateObject(new Date()),
            text: text,
            firstInDate: false,
            isSelect: false,
            selectedMessages: isReplying ? [...selectedMessages] : [],
        };

        // checking date-separator status
        message.firstInDate =
            !messages.length ||
            messages[messages.length - 1].date !== message.date;

        // update messages state
        addition(message);
        setSelectedMessages([]);
    };

    const handleSelectMessage = (message) => {
        if (selectedMessages.includes(message)) {
            const index = selectedMessages.findIndex(
                (value) => value.id === message.id
            );

            setSelectedMessages([
                ...selectedMessages.slice(0, index),
                ...selectedMessages.slice(index + 1),
            ]); // if message is already includes than delete

            changeSelectedStatus(message, false);
        } else {
            setSelectedMessages([...selectedMessages, message]);
            changeSelectedStatus(message, true);
        }
    };

    // click edit or delete icons on messages

    const handleClickDelete = (message) => {
        if (!isShowModal.value) {
            setModal({
                value: true,
                messages: [...message],
            });
        } else {
            setModal({
                value: false,
                messages: [],
            });
        }
    };

    const handleClickEdit = (message) => {
        if (message.author === 'firstSender') {
            setEditFirst({ value: true, message: message });
        } else {
            setEditSecond({ value: true, message: message });
        }
    };

    const cancelEditing = (author) => {
        if (author === 'firstSender') {
            setEditFirst({
                value: false,
                message: {},
            });
        } else {
            setEditSecond({
                value: false,
                message: {},
            });
        }
    };

    const changeEditedMessage = (message, newText) => {
        let messageCopy = getMessageObject(message.id);
        messageCopy.text = newText;
        insertion(messageCopy);

        if (message.author === 'firstSender') {
            setEditFirst({
                value: false,
                message: {},
            });
        } else {
            setEditSecond({
                value: false,
                message: {},
            });
        }
    };

    //multiple changing
    // to set up select status
    const changeSelectedStatus = (message, isAddSelection) => {
        let messageCopy = getMessageObject(message.id);
        messageCopy.isSelect = isAddSelection;
        insertion(messageCopy);
    };
    //deletion
    //click on multiple deletion button
    const handleDeleteSelection = () => {
        setModal({
            value: true,
            messages: [...selectedMessages],
        });
    };

    // modal control answers (from Modal component)
    const modalConfirmDeletion = () => {
        const filteredArray = messages.filter((mes) => {
            return !isShowModal.messages.includes(mes);
        });
        log(filteredArray);
        replacement(filteredArray);
        setSelectedMessages([]);
        setModal({ value: false, messages: [] });
    };

    const modalRejectDeletion = () => {
        setModal({ value: false, messages: [] });
    };

    return (
        <div className={styles.chat}>
            <Sender
                sendMessage={sendMessage}
                cancelEditing={cancelEditing}
                isEdit={isEditFirst}
                author="firstSender"
                changeEditedMessage={changeEditedMessage}
                selectedMessageMode={selectedMessageModeFirst}
                handleDeleteSelection={handleDeleteSelection}
                selectedMessages={selectedMessages}
            />

            {isShowModal.value && (
                <ModalWindow
                    modalConfirmDeletion={modalConfirmDeletion}
                    modalRejectDeletion={modalRejectDeletion}
                    count={isShowModal.messages.length}
                    visible={isShowModal.value}
                />
            )}

            <ChatHistory
                handleClickEdit={handleClickEdit}
                handleClickDelete={handleClickDelete}
                handleSelect={handleSelectMessage}
                messages={messages}
                reference={chatRef}
            />

            <Sender
                sendMessage={sendMessage}
                cancelEditing={cancelEditing}
                isEdit={isEditSecond}
                author="secondSender"
                changeEditedMessage={changeEditedMessage}
                selectedMessageMode={selectedMessageModeSecond}
                handleDeleteSelection={handleDeleteSelection}
                selectedMessages={selectedMessages}
            />
        </div>
    );
}