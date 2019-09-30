import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { getCursos } from './api';

class App extends Component{

  constructor(props) {
    super(props);
    this.state = {
        cities: [],
        courses:[],
        semesters: [],
        selectedCity: "",
        selectedCourse: "",
        selectedSemester: "",
        selectedValue: 1500,
        filterPresencial: false,
        filterEad: false,
        dados: [],
        courseChecked: 0,
        favourites: [],
        modal_overlay: "modal-overlay closed",
        modal: "modal closed"
    }
    
  }

  componentDidMount() {

    getCursos().subscribe(
      response => {
        // console.log(response.data);
        let cidades = [], cursos = [], semestres = [], dados = [];
        dados = response.data;
        dados.map((item, index) => {
          if(!cidades.includes(item.campus.city)){
            cidades.push(item.campus.city);
          }
          if(!cursos.includes(item.course.name)){
              cursos.push(item.course.name);
          }
          if(!semestres.includes(item.enrollment_semester)){
              semestres.push(item.enrollment_semester);
          }
          item['checked'] = false;
          return item;
        });
        cidades.sort((a, b) => (a>b)?1:-1);
        cursos.sort((a, b) => (a>b)?1:-1);
        dados.sort((a, b) => {
            if(a.university.name<b.university.name){
                return -1;
            }
            if(a.university.name>b.university.name){
                return 1;
            }
            return (a.course.name<b.course.name)?-1:1
        });

        console.log(dados);
        
        localStorage.setItem("opcoes_cursos", JSON.stringify(dados));

        this.setState({semesters: semestres});

        this.setState({dados: dados});
        let cidadesFromApi = cidades.map(city => {return {value: city, display: city}});
        this.setState({ cities: [{value: '', display: '(Escolha sua cidade)'}].concat(cidadesFromApi) });
        
        let cursosFromApi = cursos.map(course => {return {value: course, display: course}});
        this.setState({ courses: [{value: '', display: '(Escolha seu curso)'}].concat(cursosFromApi) });
        
      }
    );
    if (localStorage.getItem("cursos_favoritos") === null) {
      localStorage.setItem("cursos_favoritos", JSON.stringify([]));
    }else{
      this.setState({favourites: JSON.parse(localStorage.getItem("cursos_favoritos"))});
    }
  }

  populateTable = (item, i) => {
    return (<div key={i} className="linha"> 
      <div className="celula_checkbox">
        <input type="checkbox" value={i} className="dv_cursos_checkbox" onChange={this.toggleCheckbox} ></input>
      </div>
      <div className="celula_logo">
        <img className="logo_table" src={item.university.logo_url}></img>
      </div>
      <div className="celula_curso">
        <div className="text_main_verde">{item.course.name}</div>
        <div className="text_complement_left">{item.course.level}</div>
      </div>
      <div className="celula_valor">
        <div className="text_main">{"Bolsa de "+item.discount_percentage+"%"}</div>
        <div className="text_main">{"R$ "+item.price_with_discount+"/mês"}</div>
      </div>
    </div>);
  }

  toggleCheckbox = (e) => {
    const pos = e.target.value;
    this.state.dados[pos].checked = !this.state.dados[pos].checked;
    console.log(this.state.dados[pos]);
    let quant_checked = this.state.courseChecked;
    if(e.target.checked){
      quant_checked++;
    }else{
      quant_checked--;
    }
    this.setState({courseChecked: quant_checked});
  }

  addToFavorites = () => {
    let favoritos = JSON.parse(localStorage.getItem("cursos_favoritos"));
    this.state.dados.map((item, i) => {
      if(item.checked){
        if(!this.existeDentroArray(item, favoritos)){
          favoritos.push(item);
        }
      }
    });
    if(JSON.stringify(favoritos) !== localStorage.getItem("cursos_favoritos")){
        localStorage.setItem("cursos_favoritos", JSON.stringify(favoritos));
        this.setState({favourites: favoritos});
        this.setState({courseChecked: 0});
        // montaListaCursos();
        // criarCardsFavoritos();
    }
  }

  removeFromFavorites = (e) => {
    let pos = e.target.getAttribute("val-pos");
    console.log(pos);
    let favoritos = this.state.favourites;
    favoritos.splice(pos, 1);
    this.setState({favourites: favoritos});
    localStorage.setItem("cursos_favoritos", JSON.stringify(favoritos));
  }

  existeDentroArray = (elemento, array) =>{
    for (let item of array) {
        if(JSON.stringify(item) === JSON.stringify(elemento)){
            return true;
        }
    }
    return false;
  }

  openModal = () => {
    this.setState({modal_overlay: "modal-overlay"});
    this.setState({modal: "modal"});
  }

  
  closeModal = () => {
    this.setState({modal_overlay: "modal-overlay closed"});
    this.setState({modal: "modal closed"});
  }

  clickSemester = (e) => {
    console.log();
    let semestre = e.target.getAttribute("val-sem");
    if(semestre !== this.state.selectedSemester){
      this.setState({selectedSemester: semestre});
    }
  }

  changeValue = (e) => {
    this.setState({selectedValue: e.target.value});
  }

  checkPresencial = (e) => {
    this.setState({filterPresencial: !this.state.filterPresencial});
  }

  checkEad = (e) => {
    this.setState({filterEad: !this.state.filterEad});
  }

  render(){
    /* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header> */
    
    return (
      <div className="App">
          <header >
            <div className="info">
                <div className="table_center_parent" >
                    <div className="table_center_child">
                        <i className="fa fa-info-circle icone" ></i> 
                        <div className="only_mobile">Ajuda</div>
                    </div>
                    <div className="table_center_child left_align " >
                        <div className="text_main only_desktop">Como funciona</div>
                    </div>
                    <hr className="vr " />
                    <div className="table_center_child " >
                        <i className="fa fa-whatsapp icone only_desktop"  ></i> 
                    </div>
                    <div className="table_center_child left_align " >
                        <div className="text_main only_desktop">0800 123 2222</div> 
                        <div className="text_complement only_desktop">Envie uma mensagem ou ligue</div>
                    </div>
                </div>
            </div>
            <div className="logo">
                <img src="assets/images/logo-querobolsa.svg" alt="querobolsa" height="40px" />
            </div>
            <div className="user">
                <div className="table_center_parent" >
                    <div className="table_center_child right_align" >
                        <div className="text_main only_desktop">Nome Sobrenome</div>
                    </div>
                    <hr className="vr only_mobile" />
                    <div className="table_center_child" >
                        <i className="fa fa-user-circle-o icone" ></i>
                        <div className="only_mobile">Conta </div>
                    </div>
                </div>
            </div>
            
                  
            <div className="topnav" >
                <a href="#" id="minha_conta">Minha conta</a>
                <a href="#" className="only_desktop">Pré-matrículas</a>
                <a href="#" className="only_desktop">Bolsas favoritas</a>
                <div className="dropdown only_mobile">
                    <button className="dropbtn">Menu 
                        <i className="fa fa-caret-down"></i>
                    </button>
                    <div className="dropdown-content">
                        <a href="#">Pré-matrículas</a>
                        <a href="#">Bolsas favoritas</a>
                    </div>
                </div> 
            </div>
        </header>
        <main >
            <ul className="breadcrumb only_desktop">
                <li><a href="#">Home</a></li>
                <li><a href="#">Minha conta</a></li>
                <li>Bolsas favoritas</li>
            </ul>
            <a href="#" className="breadcrumb_mobile only_mobile"><i className="fa fa-angle-left"></i> Minha conta</a>

            <h1 style={{fontWeight: 'bold',fontSize: '18px',padding: '5px'}}>Bolsas favoritas</h1>
            <p>Adicione bolsas de cursos e faculdades do seu interesse e receba atualizações com as melhores ofertas disponíveis.</p>

            <div id="nav_semestres">
              <a className={this.state.selectedSemester==""?"semestre ativo":"semestre"} val-sem="" onClick={this.clickSemester} >Todos os semestres</a>
              {
                this.state.semesters.map((item, i) => {
                  let semestre_array = item.split(".");
                  return (
                    <a key={i} className={this.state.selectedSemester==item?"semestre ativo":"semestre"} val-sem={item} onClick={this.clickSemester} >{semestre_array[1]+"º semestre de "+semestre_array[0]}</a>
                  );
                })
              }
            </div>
      

            <div id="favoritos">
              <div className="card">
                <span className="fa-stack icone_grande_azul" onClick={this.openModal}>
                  <i className="fa fa-circle-thin fa-stack-2x"></i>
                  <i className="fa fa-plus fa-stack-1x"></i>
                </span>
                <div className="text_main">Adicionar bolsa</div>
                <div className="text_complement">Clique para adicionar bolsas de cursos do seu interesse</div>
              </div>
              {
                this.state.favourites.map((item, i)=> {
                  if( this.state.selectedSemester === "" || this.state.selectedSemester === item.enrollment_semester ){
                    return (
                      <div key={i} className="card">
                        <img className="logo_table" src={item.university.logo_url} alt={item.university.name} />
                        <div className="text_main_v2">{item.university.name}</div>
                        <div className="text_main_v2">{item.course.name}</div>
                        <div className="text_main_v2">{item.university.score}</div>
                        <hr />
                        <div className="text_main_v2">{item.course.kind+" - "+item.course.shift}</div>
                        <div className="text_complement">{"Início das aulas em "+item.start_date}</div>
                        <hr />
                        {item.enabled?(
                          <div>
                            <div className="text_main_v2">{"Mensalidade com o Quero Bolsa"}</div>
                            <div className="text_complement tachado">{"R$ "+item.full_price}</div>
                            <div className="text_main_v2">{"R$ "+item.price_with_discount}</div>
                          
                          </div>
                          ):(
                          <div>
                            <div className="text_main_v2">{"Bolsa indisponível"}</div>
                            <div className="text_complement">{"Entre em contato com o nosso "}</div>
                            <div className="text_main_v2">{"atendimento para saber mais"}</div>

                          </div>
                          )}
                          <div className="div_botoes"> 
                            <button className="btn btn_branco" val-pos={i} onClick={this.removeFromFavorites}>Excluir</button>
                            {item.enabled?(
                              <button className="btn btn_amarelo">Ver oferta</button>
                            ):(
                              <button className="btn btn_indisponivel">Indisponível</button>
                            )}
                          </div>
                      </div>
                    );
                  }
                })
              }
            </div>


        </main>
        <footer >
            <div className="contato"  >
                <div className="table_center_parent">
                    <div className="table_center_child " >
                        <i className="fa fa-whatsapp icone" ></i> 
                    </div>
                    <div className="table_center_child left_align" >
                        <div className="text_main">0800 123 2222</div> 
                        <div className="text_complement only_mobile">Segunda a Sexta de 8h às 22h</div>
                        <div className="text_complement only_desktop">Seg - Sex 8h-22h</div>
                    </div>
                </div>
            </div>

            <div className="chat">
                <div className="table_center_parent" >
                    <div className="table_center_child">
                        <i className="fa fa-comments-o icone" ></i> 
                        <div className="only_mobile">Chat</div>
                    </div>
                    <div className="table_center_child left_align" >
                        <div className="text_main only_desktop">Chat ao vivo</div>  
                        <div className="text_complement only_desktop">Seg - Sex 8h-22h</div>
                    </div>
                </div>
            </div>

            <div className="email">
                <div className="table_center_parent" >
                    <div className="table_center_child">
                        <i className="fa fa-envelope icone" ></i> 
                        <div className="only_mobile" >E-mail</div>
                    </div>
                    <div className="table_center_child left_align" >
                        <div className="text_main only_desktop">Mande um e-mail</div>  
                        <div className="text_complement only_desktop">Respondemos Rapidinho</div>
                    </div>
                </div>
            </div>
            <div className="central">
                <div className="table_center_parent" >
                    <div className="table_center_child">
                        <i className="fa fa-info-circle icone" ></i> 
                        <div className="only_mobile">Ajuda</div>
                    </div>
                    <div className="table_center_child left_align" >
                        <div className="text_main only_desktop">Central de ajuda</div>  
                        <div className="text_complement only_desktop">Encontre todas as respostas</div>
                    </div>
                </div>
            </div>
            <div className="rodape">
                <div id="msg_rodape">Feito com <i className="fa fa-heart-o"  ></i> pela Quero Educação</div>
            </div>    
        </footer>

        <div className={this.state.modal_overlay} id="modal-overlay"></div>
        <div className={this.state.modal} id="modal">
            <a title="Close" id="close-button" className="close-button" onClick={this.closeModal}><i className="fa fa-times" aria-hidden="true"></i></a>
            <div className="modal-content">
                <div className="modal-header">
                    <h2 id="modal-header_titulo">Adicionar bolsa</h2>
                    <h3>Filtre e adicione as bolsas de seu interesse.</h3>
                </div>
                <div className="modal-body">
                    <form className="formulario" action="">
                        <label id="lbl_cidade" className="form_label" htmlFor="sel_cidade">SELECIONE SUA CIDADE</label>
                        <select name="" id="sel_cidade" onChange={(e) => this.setState({selectedCity: e.target.value})} >
                        {this.state.cities.map((city) => <option key={city.value} value={city.value}>{city.display}</option>)}
                        </select>
                        <label id="lbl_curso" className="form_label" htmlFor="sel_curso">SELECIONE O CURSO DE SUA PREFERÊNCIA</label>
                        <select name="" id="sel_curso" onChange={(e) => this.setState({selectedCourse: e.target.value})}>
                        {this.state.courses.map((course) => <option key={course.value} value={course.value}>{course.display}</option>)}
                        </select>
                        <label id="lbl_modalidade" className="form_label" htmlFor="">COMO VOCÊ QUER ESTUDAR?</label>
                        <div id="dv_espaco"></div>
                        <div id="chk_modalidade">
                            <label htmlFor="chk_presencial"><input type="checkbox" name="presencial" value={this.state.filterPresencial} id="chk_presencial" onChange={this.checkPresencial} />Presencial</label>                            
                            <label htmlFor="chk_distancia"><input type="checkbox" name="distancia" value={this.state.filterEad} id="chk_distancia" onChange={this.checkEad} />A distancia</label>                            
                        </div>
                        <label id="lbl_valor" className="form_label" htmlFor="">ATÉ QUANTO PODE PAGAR?</label>
                        <span id="spn_range_valor">{this.state.selectedValue}</span>
                        <input type="range" name="valor" id="ipt_range_valor" min="100" max="10000" value={this.state.selectedValue} onChange={this.changeValue}  />
                    </form>
                    <div id="dv_header_cursos" >
                        <div style={{textAlign: "left"}}>
                            Resultado:     
                        </div>
                        <div style={{textAlign: "right"}}>
                            Ordenar por <div id="dv_ordenacao" >Nome da Faculdade <i className="fa fa-angle-down"></i></div>
                        </div>
                    </div>
                    <div id="dv_cursos" className="tabela">
                      {this.state.dados.map((item, i)=> {
                          if(this.state.selectedCity === "" || item.campus.city === this.state.selectedCity){
                            if(this.state.selectedCourse === "" || item.course.name === this.state.selectedCourse){
                              if(this.state.selectedValue > item.price_with_discount){
                                if(!this.state.filterPresencial || item.course.kind === "Presencial"){
                                  if(!this.state.filterEad || item.course.kind === "EaD"){
                                    if(!this.existeDentroArray(item, this.state.favourites)){
                                      return this.populateTable(item, i);
                                    }
                                  }
                                }
                              }
                            }
                          }
                        })
                      }
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn_branco" id="btn_cancelar" onClick={this.closeModal} >Cancelar</button>
                    <button className={this.state.courseChecked==0?"btn btn_indisponivel":"btn btn_amarelo"} id="btn_adicionar" onClick={this.addToFavorites} >Adicionar bolsa(s)</button>
                </div>

            </div>
    </div>
      </div>
    );
  }
}

export default App;
