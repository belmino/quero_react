import Axios from 'axios-observable';


const getCursos = () => {
    return Axios.get('https://testapi.io/api/redealumni/scholarships')
        // .subscribe(
        //     response => console.log(response),
        //     error => console.log(error)
        //   );
}

export { getCursos };