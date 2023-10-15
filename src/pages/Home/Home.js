//testing table component//
import UniversalTable from "../../components/UniversalTable/UniversalTable";
//-----------------------//

export default function Home() {
  this.pageWrapper = document.createElement("div");
  this.placeholderText = document.createElement("h2"); // temp placeholder
  this.placeholderText.textContent = "Home page";
}

Home.prototype.render = function (parent) {
  this.pageWrapper.append(this.placeholderText);

  //testing table component//
  const table = new UniversalTable(
    [
      { name: "Gogi", age: 54, sex: "male", hobby: "PC gaming" },
      { name: "Gigi", age: 13, sex: "male", hobby: "PC gaming" },
      { name: "Gagi", age: 27, sex: "female", hobby: "PC gaming" },
    ],
    {
      parent: this.pageWrapper,
      headers: [
        { name: "name", title: "Name" },
        { name: "age", title: "Age" },
        { name: "sex", title: "Sex" },
        { name: "hobby", title: "Hobby" },
      ],
    }
  );
  //-----------------------//

  table.render();
  parent.append(this.pageWrapper);
};
