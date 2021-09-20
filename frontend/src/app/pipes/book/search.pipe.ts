import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(data: any, search: any, type: string): any {
    if(type == "Título"){
      if(search != undefined && data != undefined){
        return data.filter((d:any) =>{
          return d.title.toLowerCase().includes(search.toLowerCase());
        })
      }else{
        return data;
      }
    }else{
      if(search != "" && data != undefined){
        return data.filter((d:any) =>{
          return d.key_words.includes(search);
        })
      }else{
        return data;
      }
    }
  }

}
