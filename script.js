const textInput = document.getElementById( 'searchText');
const btnSubmit = document.getElementById("submit");
const btnReset = document.getElementById("reset");

class ProjectData{
    constructor(id,name){
        this.id = id;
        this.name = name;
    }
    getProjectID(){
        return this.id;
    }
    getProjectName(){
        return this.name;
    }
    setProjectID(id){
        this.id = id;
    }
    setProjectName(name){
        this.name = name;
    }

}


class ProjectDataFetch {

    constructor() {
        this.projectsDataList = [];
    }

    //get projects from json file
    async getProjects() { 

        let data;
        let response = await fetch("./projects.json");
        data = await response.json();
        
        for (let i = 0; i < data.projects.length; i++) {
            this.projectsDataList.push(this.createProjectData(data.projects[i].id, data.projects[i].name));
        }
        
        return this.projectsDataList;

    }

    //function for searching projects by name
    async filterProjects(searchText) {

        let filteredData = [];
        this.projectsDataList.forEach(element => {
            let projectName = element.name;
            if (projectName.toLowerCase().search(searchText.toLowerCase()) >= 0) {
                filteredData.push(element);
            }
        });
       
        return filteredData;

    }

    //Function for creating project object
    createProjectData(id, name) {
        return new ProjectData(id, name);
    }
}


class LoadProjects {
    
    constructor() {
        this.newprojectDataFetch = new ProjectDataFetch;
    }

    //JSON file is fetch and return to the user
    async startDo() {
        
        try {
            this.disableSearch(true);
            let myArr = await this.newprojectDataFetch.getProjects();
            this.hideMessage();
            this.fillList(myArr);
        } catch (e) {
            this.showMessage("Something is wrong with Json file");
        }
        this.disableSearch(false);
    }

    //Function for filter projects
    async searchProjects() {
        
        const searchText = textInput.value;
        this.disableSearch(true);
        this.clearList();
        let myArr = await this.newprojectDataFetch.filterProjects(searchText);
        this.hideMessage();
        this.fillList(myArr);
        this.disableSearch(false);
    }

    //Function for disable search button and serach bar
    disableSearch(setEnable){
        textInput.disabled = setEnable;
        btnSubmit.disabled = setEnable;
    }

    //create list with the results
    fillList(myArr) {
        this.clearList();
        var projectsDataListView = document.getElementById("projects");
        if (myArr.length === 0) {
            this.showMessage("No results found for given project name...");
        } else {
            myArr.forEach(element => {
                var node = document.createElement('li');
                node.appendChild(document.createTextNode(element['name']));
                projectsDataListView.appendChild(node);
            });
        }
    }

    //Function to clear the list
    clearList() {
        var projectsDataListView = document.getElementById("projects");
        var child = projectsDataListView.lastElementChild;
        while (child) {
            projectsDataListView.removeChild(child);
            child = projectsDataListView.lastElementChild;
        }
    }

    //Show messages
    showMessage(message) {
        const messageView = document.getElementById('error-message');
        messageView.innerHTML = message;
        messageView.style.display = 'block';
    }

    //Hide the message
    hideMessage() {
        const messageView = document.getElementById('error-message');
        messageView.innerHTML = '';
        messageView.style.display = 'none';
    }

}


let newloadProjects = new LoadProjects();
const submitButton = document.getElementById("submit");

//Waiting until document is loaded
document.addEventListener("DOMContentLoaded", () => {

    //Program initiation
    newloadProjects.startDo();

    //Search function in program
    submitButton.addEventListener("click", function () {
        newloadProjects.searchProjects();
    });

});