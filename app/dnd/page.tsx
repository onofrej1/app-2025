"use client";
import React, { useEffect, useState } from "react";
import "./dnd.css";
import { getTasks, updateTask } from "@/actions";

const tempCls = 'invisible';

export default function Dnd() {
  const groups = ["TODO", "INPROGRESS", "DONE"];
  const [items, setItems] = useState([]);
  const [activeItem, setActiveItem] = useState<HTMLDivElement>();

  useEffect(() => {
    async function fetchTasks() {
      const tasks = await getTasks();
      const t = tasks.map((task) => {
        return {
          id: task.id,
          group: task.status,
          value: task,
        };
      });
      setItems(t);
    }
    fetchTasks();
  }, []);

  const onDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    group: string
  ) => {
    setActiveItem(null);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.clearData();
    e.dataTransfer.setData("idText", (e.target as HTMLDivElement).id);
    e.dataTransfer.setData("groupText", group);
    setActiveItem(e.target as HTMLDivElement);
  };

  const onDragEnd = (e: any, group: string) => {
    const el = e.target as HTMLDivElement;
    el.classList.remove("group-over");    
    el.classList.remove(tempCls);
    activeItem.classList.remove(tempCls);
  };

  const onDragOver = (e: any) => {
    e.preventDefault();
  };

  const onDragEnter = (e, group) => {
    const el = e.target as HTMLDivElement;
    e.preventDefault();
    const sourceGroup = e.dataTransfer.getData("groupText");
    if (group !== sourceGroup) {
      el.classList.add("group-over");
    }
  };

  const onDragLeave = (e, group) => {
    e.preventDefault();
    const el = e.target as HTMLDivElement;        
    el.classList.remove("group-over");
  };   

  const onDragEnterItem = (e: any) => {
    e.preventDefault();
    const el = activeItem;        
    const parent = e.target.parentNode;
    //const c = el.cloneNode();
    
    /*var para = document.createElement( "p" );
    para.classList.add(tempCls);
    para.innerHTML = el.innerHTML;*/
    //para.appendChild( document.createTextNode("paragraph"));
    //setActiveItem(para);
    el.classList.add(tempCls);
    if (isBefore(el, e.target)) {
      //el.classList.add(tempCls);
      parent.insertBefore(el, e.target);
    } else {
      //el.classList.add(tempCls);
      parent.insertBefore(el, e.target.nextSibling);
    }          
  };

  const onDragLeaveItem = (e, group) => {            
    //e.preventDefault();
  };

  function isBefore(el1, el2) {
    if (el2.parentNode === el1.parentNode)
      for (
        var cur = el1.previousSibling;
        cur && cur.nodeType !== 9;
        cur = cur.previousSibling
      )
        if (cur === el2) return true;
    return false;
  }  

  const onDrop = (e: React.DragEvent<HTMLDivElement>, group: string) => {
    e.preventDefault();
    activeItem.classList.remove(tempCls);
    const id = e.dataTransfer.getData("idText");  
    console.log(id);
    const newItems = items.map((i) => {
      if (i.id === Number(id)) {
        console.log(group);
        i.group = group;
        i.value.status = group;
        //updateTask(i.value);
      }
      return i;
    });
    const el = e.target as HTMLDivElement;
    el.classList.remove("group-over");

    setItems(() => [...newItems]);
  };

  return (
    <div className="groups flex flex-wrap p-1 m-1">
      {groups.map((group) => (
        <div
          className="group m-3 p-3 bg-green-600 min-w-[150px]"
          key={group}
          id={group}
          onDrop={(e) => onDrop(e, group)}
          onDragEnter={(e) => onDragEnter(e, group)}
          onDragLeave={(e) => onDragLeave(e, group)}
          onDragOver={onDragOver}
        >
          <h1 className="title">{group}</h1>
          <div key={'wrapper'+group}>
            {items
              .filter((item) => item.group === group)
              .map((thing) => (
                <div
                  key={thing.group+'-'+thing.id}
                  id={thing.id}
                  className="mt-2 p-2 hover:cursor-move bg-yellow-300 relative transition-all duration-1000"
                  draggable
                  onDragStart={(e) => onDragStart(e, group)}
                  onDragEnd={(e) => onDragEnd(e, group)}
                  //onDrop={(e) => handleDrop(e, group)}
                  onDragEnter={(e) => onDragEnterItem(e)}
                  onDragLeave={(e) => onDragLeaveItem(e, group)}
                >
                  {thing.value.title} - {thing.value.id} - {thing.value.status}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
