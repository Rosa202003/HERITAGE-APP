const buildings = [
  {
    id: 1,
    name: "Old Boma",
    location: "Sokoine Drive, Dar es Salaam",
    description: "One of the oldest heritage buildings in Dar es Salaam.",
    image: "oldboma.jpg",
  },
  {
    id: 2,
    name: "St. Joseph Cathedral",
    location: "Kivukoni, Dar es Salaam",
    description: "Historic Roman Catholic cathedral.",
    image: "cathedral.jpg",
  },
];

const getBuildings = (req, res) => {
  res.json(buildings);
};

const getBuildingById = (req, res) => {
  const building = buildings.find((b) => b.id === parseInt(req.params.id, 10));

  if (!building) {
    return res.status(404).json({
      message: "Building not found",
    });
  }

  res.json(building);
};

module.exports = {
  getBuildings,
  getBuildingById,
};
