
class ApiResponse {
     constructor(
         data ,
         message = "sucsess"
     ){
        this.data = data,
        this.message = message
     }
}

export {ApiResponse}