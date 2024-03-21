const [data, setData] = useState(null);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = {};
        for (let i = 1; i <= 7; i++) {
          for (let j = 1; j <= 7; j++) {
            newData[`${i}-${j}`] = await GetData(i, j);
          }
        }
        setData(newData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const GetData = async (i, j) => {
    try {
      // Assuming you want to use i and j as part of the key
      const asyncData = await AsyncStorage.getItem(`${i}-${j}`);
      return asyncData !== null ? "T" : "F";
    } catch (error) {
      console.error(`Error fetching data for (${i}, ${j}) from AsyncStorage:`, error);
      return null;
    }
  };