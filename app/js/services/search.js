function Search () {
  const service = {
    scopeMixins: {
      difficulty: '',
      composer:   '',
      songName:   ''
    }
  };

  return service;
}

export default {
  name: 'Search',
  fn: Search
};
