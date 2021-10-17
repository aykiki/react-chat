import styles from './Sender.module.scss';
import { useEffect, useState } from 'react';
import { Space, Input, Button, List } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

export default function Sender(props) {
    const [inputValue, setInputValue] = useState(
        props.isEdit.message.text || ''
    );

    const [isReplySelectedMessages, setReplySelectedMessages] = useState(false);

    const handleExitEdit = () => {
        setInputValue('');
        props.cancelEditing(props.author);
    };

    const handleSubmitMessage = (e) => {
        e.preventDefault();

        if (/^ *$/.test(inputValue)) {
            return;
        }
        if (isReplySelectedMessages) {
            props.sendMessage(inputValue, props.author, true);
            setReplySelectedMessages(false);
            setInputValue('');
            return;
        }

        if (props.isEdit.message.text === inputValue) {
            setInputValue('');
            props.cancelEditing(props.author);
            return;
        }

        if (props.isEdit.value) {
            props.changeEditedMessage(props.isEdit.message, inputValue);
        } else if (inputValue !== '' || inputValue !== ' ') {
            props.sendMessage(inputValue, props.author, false);
        }

        setInputValue('');
    };

    useEffect(() => {
        if (props.isEdit.value) {
            setInputValue(props.isEdit.message.text);
        }
    }, [props.isEdit]);

    useEffect(() => {
        if (!props.selectedMessages.length) {
            setReplySelectedMessages(false);
        }
    }, [props.selectedMessages]);

    const handleClickReply = () => {
        setReplySelectedMessages((prevState) => !prevState);
    };

    return (
        <Space direction="vertical" className={styles.sender}>
            {isReplySelectedMessages && (
                <Space className={styles.replyingBox}>
                    <List
                        itemLayout="horizontal"
                        dataSource={props.selectedMessages}
                        split={false}
                        renderItem={(item) => (
                            <List.Item>
                                <p className={styles.replyingMessage}>
                                    {item.text}
                                </p>
                            </List.Item>
                        )}
                    />
                </Space>
            )}
            <Space>
                {(props.selectedMessageMode === 'reply' ||
                    props.selectedMessageMode === 'both') && (
                    <Button onClick={handleClickReply}>Reply</Button>
                )}
                {props.selectedMessageMode === 'both' && (
                    <Button onClick={props.handleDeleteSelection} danger>
                        Delete
                    </Button>
                )}
            </Space>
            <Space>
                <Input
                    placeholder="Enter your message"
                    onPressEnter={(e) => handleSubmitMessage(e)}
                    onChange={(e) => setInputValue(e.target.value)}
                    value={inputValue}
                    suffix={
                        <CloseCircleOutlined
                            className={styles.inputForm}
                            data-visible={props.isEdit.value}
                            onClick={handleExitEdit}
                        />
                    }
                />
                <Button type="primary" onClick={(e) => handleSubmitMessage(e)}>
                    Send
                </Button>
            </Space>
        </Space>
    );
}
