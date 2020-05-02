import React from 'react';
import notify from 'devextreme/ui/notify';

export default function Notify(props){
    const {event, text, type} = props;
    return notify(`${event} "${text}" recipe`, type, 800);
}