import React, { Component } from "react"
import './main.css'
import TodoItem from "./TodoItem";
import Control from "./Control";

class Main extends Component {

    addFlag = true;
    searchFlag = false;
    constructor(){
        super();
        this.inputRef = React.createRef();
        this.state = {
            active: [],
            complete : [],
            data : [],
            search : [],
            activeFlag : false,
            completeFlag : false,
            editClick : false,
            index: 0
        }
    }

    addBtnClickHandler = (e) => {
        this.inputRef.current.classList.remove("hidden")
        this.inputRef.current.focus();
        this.addFlag = true;
        this.searchFlag = false;
        // Element.nextElementSibling
    }

    searchBtnClickHandler = (e) => {
        this.inputRef.current.classList.remove("hidden")
        this.inputRef.current.focus();
        this.addFlag = false;
        this.searchFlag = true;
        // Element.previousElementSibling 
    }

    searchText = (e) => {
        if(!this.searchFlag) return;
        let searchValue = this.inputRef.current.value;
        
        if(this.state.activeFlag){
            if(searchValue === ""){
                this.setState(pst => ({...pst,search : 
                    pst.active}))
            }
            else{
                this.setState(pst => ({...pst,search : 
                    pst.active.filter(ele => ele.title === searchValue)}))
            }
        }
        else if(this.state.completeFlag){
            if(searchValue === ""){
                this.setState(pst => ({...pst,search : 
                    pst.complete}))
            }
            else{
                this.setState(pst => ({...pst,search : 
                    pst.complete.filter(ele => ele.title === searchValue)}))
            }
        }
        else{
            if(searchValue === ""){
                this.setState(pst => ({...pst,search : 
                    pst.data}))
            }
            else{
                this.setState(pst => ({...pst,search : 
                    pst.data.filter(ele => ele.title === searchValue)}))
            }
        }
    }

    changeCheckBox = (e) => {
        let id = e.target.id.split("-")[1]
        this.setState((prevState) => ({
                
            data : prevState.data.map(el => {
                if(el.id === Number(id)){
                    el.checked = el.checked ? false : true;
                }
                return el
            }),
            active : this.state.data.filter((ele) => ele.checked===false),
            complete : this.state.data.filter((ele) => ele.checked===true)
        }))
    }

    deleteBtnHandler = (e) => {
        let id = e.target.id.split("-")[1]
        this.setState((prevState) => ({...prevState,
            data : prevState.data.filter(ele => ele.id !== Number(id)),
            active :  prevState.active.filter(ele => ele.id !== Number(id)),
            complete :  prevState.complete.filter(ele => ele.id !== Number(id)),
            search : prevState.search.filter(ele => ele.id !== Number(id))
        }))
    }

    editBtnHandler = (e) => {
        let id = Number(e.target.id.split("-")[1]);
        this.setState(pst => ({...pst, editClick : true, index : id}))
    }

    saveBtnHandler= (e) => {
        this.setState(pst => ({...pst, editClick : false}))
    }

    changeTitle = (e) => {
        if(e.key === "Escape") this.saveBtnHandler();
        if(e.key!=="Enter") return
        
        this.setState((prevState) => ({...prevState,
                
            data : prevState.data.map(el => {
                if(el.id === prevState.index){
                    el.title = (e.target.value !== "" ? e.target.value: el.title);
                }
                return el
            }),
            active : this.state.data.filter((ele) => ele.checked===false),
            complete : this.state.data.filter((ele) => ele.checked===true),
            editClick : false
        }))
    }

    inputKeyPressEventHandler = (e) => {
        if(!this.addFlag) return
        if(e.key!=="Enter" || e.target.value==="") return
        let tempid = this.state.data.length === 0 ? 1 : Math.max(...this.state.data.map(ele => ele.id))
        let addItem = {
            id: (tempid + 1),
            title: this.inputRef.current.value,
            checked : this.state.completeFlag ? true : false
        }
    
        this.setState(ps=>({...ps,
            data : [...ps.data,addItem]
        }))
        this.inputRef.current.value = "";
    }

    btnClickHandler = (e) => {
        if(e.target.classList.contains("activebtn")){
            this.setState({
                activeFlag : true,
                completeFlag : false,
                active : this.state.data.filter((ele) => ele.checked===false)
            })
        }
        else if(e.target.classList.contains("completedbtn")){
            this.setState({
                completeFlag : true,
                activeFlag : false,
                complete : this.state.data.filter((ele) => ele.checked===true)
            })
        }
        else{
            this.setState({
                completeFlag : false,
                activeFlag : false
            })
        }
    }

    actionHandler = (e) => {
        let value = e.target.value;
        if(value === "SelectAll"){
            this.setState((prevState) => (
                prevState.data.map(ele => ele.checked = true)
            ))
        }
        if(value === "Delete-Selected"){
            this.setState((prevState) => ({
                data : prevState.data.filter(ele => ele.checked === false)
            }))
        }
        if(value === "UnselectAll"){
            this.setState((prevState) => (
                prevState.data.map(ele => ele.checked = false)
            ))
        }
        e.target.value = "Actions";
    }

    atozSorting(ar){
        this.setState((prevState) => ({...prevState,ar: ar.sort((a,b) => a.title > b.title ? 1 : -1)}))
    }
    ztoaSorting(ar){
        this.setState((prevState) => ({...prevState,ar: ar.sort((a,b) => a.title > b.title ? -1 : 1)}))
    }
    oldestSorting(ar){
        this.setState((prevState) => ({...prevState,ar: ar.sort((a,b) => a.id - b.id)}))
    }    
    newestSorting(ar){
        this.setState((prevState) => ({...prevState,ar: ar.sort((a,b) => b.id - a.id)}))
    }

    sortHandler = (e) => {
        if(e.target.value === "A-to-Z"){
            if(this.state.activeFlag) this.atozSorting(this.state.active)
            else if(this.state.completeFlag) this.atozSorting(this.state.complete)
            else this.atozSorting(this.state.data)
        }
        if(e.target.value === "Z-to-A"){
            if(this.state.activeFlag) this.ztoaSorting(this.state.active)
            else if(this.state.completeFlag) this.ztoaSorting(this.state.complete)
            else this.ztoaSorting(this.state.data)
        }
        if(e.target.value === "Oldest"){
            if(this.state.activeFlag) this.oldestSorting(this.state.active)
            else if(this.state.completeFlag) this.oldestSorting(this.state.complete)
            else this.oldestSorting(this.state.data)
        }
        if(e.target.value === "Newest"){
            if(this.state.activeFlag) this.newestSorting(this.state.active)
            else if(this.state.completeFlag) this.newestSorting(this.state.complete)
            else this.newestSorting(this.state.data)
        }
        e.target.value = "sort";
    }

    render() {
        return (
            <div>
                <h1>TODO LIST</h1>
                <input type="text" className="inputElement hidden" onKeyDown={this.inputKeyPressEventHandler} onInput={this.searchText} ref={this.inputRef}/>
                <Control  addBtnClickHandler = {this.addBtnClickHandler} searchBtnClickHandler = {this.searchBtnClickHandler} actionHandler = {this.actionHandler} sortHandler = {this.sortHandler} btnClickHandler = {this.btnClickHandler} arr = {(this.state.activeFlag &&this.state.active) || (this.state.completeFlag && this.state.complete) || this.state.data}/>

                {
                    (this.addFlag &&
                    ((this.state.activeFlag && this.state.active.map((ele) => {
                        return <TodoItem  key = {ele.id} ele = {ele} changeCheckBox={this.changeCheckBox} editBtnHandler={this.editBtnHandler} deleteBtnHandler={this.deleteBtnHandler} editClick = {this.state.editClick} index = {this.state.index} saveBtnHandler={this.saveBtnHandler} changeTitle={this.changeTitle}/>
                    }))
                    ||
                    (this.state.completeFlag && this.state.complete.map((ele) => {
                        return <TodoItem  key = {ele.id} ele = {ele} changeCheckBox={this.changeCheckBox} editBtnHandler={this.editBtnHandler} deleteBtnHandler={this.deleteBtnHandler} editClick = {this.state.editClick} index = {this.state.index} saveBtnHandler={this.saveBtnHandler} changeTitle={this.changeTitle}/>
                    }))
                    ||
                    (this.state.data.map((ele) => {
                        console.log("edit");
                        return <TodoItem  key = {ele.id} ele = {ele} changeCheckBox={this.changeCheckBox} editBtnHandler={this.editBtnHandler} deleteBtnHandler={this.deleteBtnHandler} editClick = {this.state.editClick} index = {this.state.index} saveBtnHandler={this.saveBtnHandler} changeTitle={this.changeTitle}/>
                    }))))
                    ||
                    (this.searchFlag &&
                    this.state.search.map((ele) => {
                        return <TodoItem  key = {ele.id} ele = {ele} changeCheckBox={this.changeCheckBox} editBtnHandler={this.editBtnHandler} deleteBtnHandler={this.deleteBtnHandler} editClick = {this.state.editClick} index = {this.state.index} saveBtnHandler={this.saveBtnHandler} changeTitle={this.changeTitle}/>
                    }))
                }
            </div>
        )
    }
}

export default Main



    // divClickHandler = (e) => {
    //     let id = e.target.id.split("-")[1]
    //     let clName = e.target.className;
    //     console.log(id , clName);
    //     if(clName === "checkbox"){
    //         console.log("checkbox inside");
    //         this.setState((prevState) => ({
                
    //             data : prevState.data.map(el => {
    //                 console.log("map inside");
    //                 if(el.id === Number(id)){
    //                     el.checked = el.checked ? false : true;
    //                 }
    //                 return el
    //             })
    //         }))
    //     }
    //     if(clName === "editbtn"){
    //     }
    //     if(clName === "deletebtn"){
    //         this.setState((prevState) => ({
    //             data : prevState.data.filter(ele => ele.id !== Number(id))
    //         }))
    //     }
    // }


        // renderTodoItem(){
    //     if(this.state.activeFlag){
    //         this.setState({
    //             active : this.state.data.filter((ele) => ele.checked===false)
    //         })
    //         return this.state.active;
    //     }
    //     else if(this.state.completeFlag){
    //         this.setState({
    //             complete : this.state.data.filter((ele) => ele.checked===true)
    //         })
    //         return this.state.complete;
    //     }
    //     else return this.state.data;
    // }


// this.state.data.map((ele) => {
//     return <TodoItem  key = {ele.id} ele = {ele} divClickHandler = {this.divClickHandler} checked = {ele.checked}/>
// })

// this.setState((prevState)=> (
            
//     // prevState.data.push(addItem)
//     // data : [...]
// ), ()=> console.log(this.state.data))
// console.log(this.state.data);