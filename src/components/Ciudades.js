import React, {useState, useEffect, useCallback} from 'react';
import 'antd/dist/antd.css';
import { Table, Tag, Space, Button } from 'antd';

const Ciudades = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [apiUrl,setApiUrl]=useState("https://ws.smn.gob.ar/map_items/forecast/0")
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [fechaSeleccionada, setFechaSeleccionada] = useState([0]);
    const [fechaSeleccionadaPrint, setFechaSeleccionadaPrint]= useState();
    useEffect(()=> {
      fetch(apiUrl).then(res => res.json()).then((response)=> {
        setData(response.map(item => {
          return {
            key: item._id,
            name: item.name,
            province: item.province,
            descripcion: [item.weather.morning_desc, item.weather.afternoon_desc],
            temperatura: [item.weather.morning_temp, item.weather.afternoon_temp]
          }}));
        setIsLoading(false);
        })
        
    },[apiUrl])

    useEffect(() => {
      const results = data.filter(data =>
        data.name.toLowerCase().includes(searchTerm)
      );
      setSearchResults(results);
    }, [searchTerm,data]);

    useEffect(() => {
      const result = (new Date(new Date().getTime()+24*60*60*1000*fechaSeleccionada)).toLocaleDateString()
      setFechaSeleccionadaPrint(result);
    }, [fechaSeleccionada]);

      const obtenerClimaHoy = (event) =>{
        setApiUrl("https://ws.smn.gob.ar/map_items/forecast/0")
        setSearchTerm("")
        setFechaSeleccionada(0)
      };
    
      const obtenerClimaManana = (event) =>{
        setApiUrl("https://ws.smn.gob.ar/map_items/forecast/1")
        setSearchTerm("")
        setFechaSeleccionada(1)
      };
    
      const obtenerClimaPasado = (event) =>{
        setApiUrl("https://ws.smn.gob.ar/map_items/forecast/2")
        setSearchTerm("")
        setFechaSeleccionada(2)
      };

      const obtenerClimaEnTresDias = (event) =>{
        setApiUrl("https://ws.smn.gob.ar/map_items/forecast/3")
        setSearchTerm("")
        setFechaSeleccionada(3)
      };
  
      const handleChangeSearch = e => {
        setSearchTerm(e.target.value);
      };

    const columns = [
        {
          title: "Ciudad",
          dataIndex: "name",
          key: "name",
          sorter: {
            compare: (a, b) => a.name - b.name,
            multiple: 10,
          },
          render: (text) => <a>{text}</a>,
        },
        {
          title: "Provincia",
          dataIndex: "province",
          key: "province",
        },
        {
          title: "Temperatura",
          key: "temperatura",
          dataIndex: "temperatura",
          render: (text) => (
            <div>
              {text[0]!==undefined && 
                <Tag color={"blue"}>{text[0] + "°C"}</Tag>
              }
              <Tag color={"red"}>{text[1] + "°C"}</Tag>
            </div>
          )
        }
      ];

    return (
    <div>
        <Space style={{ margin: 16 }}>
          <Button onClick={obtenerClimaHoy}>Pronóstico de hoy</Button>
          <Button onClick={obtenerClimaManana}>Pronóstico de mañana</Button>
          <Button onClick={obtenerClimaPasado}>Pronóstico a dos días</Button>
          <Button onClick={obtenerClimaEnTresDias}>Pronóstico a tres días</Button>
          <input
            type="text"
            placeholder="Buscar ciudad..."
            value={searchTerm}
            onChange={handleChangeSearch}
          />
          <Tag color={"brown"}>{fechaSeleccionadaPrint}</Tag>
        </Space>
        <Table columns ={columns}
            expandable={{
                expandedRowRender: (record) => (
                <div>
                    {record.descripcion[0]!==undefined && 
                      <p style={{ margin: 16 }}>
                      Por la mañana: {record.descripcion[0]}
                      </p>
                    }
                    {record.descripcion[1]!==undefined && 
                      <p style={{ margin: 16 }}>
                      Por la tarde: {record.descripcion[1]}
                      </p>
                    }
                </div>
                ),
                rowExpandable: (record) => record.name !== "Not Expandable"
            }}
            dataSource={searchResults}  />
        {isLoading && <p> Wait I'm loading comments for you</p>}
        </div>
    );
  }

  export default Ciudades;