import styles from './ChatHistory.module.scss';
import { List, Divider, Space } from 'antd';
import {
    CloseOutlined,
    EditOutlined,
    CheckCircleFilled,
} from '@ant-design/icons';
import 'antd/dist/antd.css';

export default function ChatHistory(props) {
    const handleClickEditIcon = (e, message) => {
        e.stopPropagation();
        props.handleClickEdit(message);
    };

    const handleClickDeleteIcon = (e, message) => {
        e.stopPropagation();
        let arr = [];
        arr.push(message);
        props.handleClickDelete(arr);
    };

    return (
        <div ref={props.reference} className={styles.chat}>
            <List
                itemLayout="horizontal"
                bordered={true}
                dataSource={props.messages}
                split={false}
                renderItem={(item) => (
                    <>
                        {item.firstInDate && (
                            <Divider plain>{item.date}</Divider>
                        )}

                        <List.Item
                            onClick={() => props.handleSelect(item)}
                            className={styles.message__wrapper}
                            data-author={item.author}
                            data-selected={item.isSelect}
                        >
                            <Space
                                direction="vertical"
                                className={styles.messageBorder}
                            >
                                <CheckCircleFilled
                                    data-visible={item.isSelect}
                                    className={styles.selectIcon}
                                />

                                <Space className={styles.message__bar}>
                                    {item.time}
                                    <EditOutlined
                                        onClick={(e) => {
                                            handleClickEditIcon(e, item);
                                        }}
                                    />
                                    <CloseOutlined
                                        onClick={(e) => {
                                            handleClickDeleteIcon(e, item);
                                        }}
                                    />
                                </Space>
                                {item.selectedMessages.length !== 0 && (
                                    <Space direction="vertical">
                                        {item.selectedMessages.map((value) =>
                                            props.messages.some(
                                                (item) => item.id === value.id
                                            ) ? (
                                                <p
                                                    className={
                                                        styles.replyingMessage
                                                    }
                                                    key={item.id}
                                                >
                                                    {value.text}
                                                </p>
                                            ) : (
                                                <p
                                                    className={
                                                        styles.replyingMessage
                                                    }
                                                    key={item.id}
                                                >
                                                    the message has been deleted
                                                    by author
                                                </p>
                                            )
                                        )}
                                    </Space>
                                )}

                                <Space className={styles.message__text}>
                                    {item.text}
                                </Space>
                            </Space>
                        </List.Item>
                    </>
                )}
            />
        </div>
    );
}
