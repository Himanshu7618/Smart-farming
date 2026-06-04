const CropCard = ({ crops, onEditCrop, onDeleteCrop }) => {
  return (
    <div className="bg-white rounded shadow p-5">
      <h2 className="text-xl font-semibold mb-4">My Crops</h2>
      {crops?.length ? (
        <div className="space-y-4">
          {crops.map((crop) => (
            <div key={crop._id} className="border rounded p-4 bg-slate-50">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{crop.cropName}</h3>
                  <p className="text-sm text-gray-600">Season: {crop.season}</p>
                  <p className="text-sm text-gray-600">Area: {crop.area}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {new Date(crop.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => onEditCrop(crop)}
                  className="px-3 py-1 rounded bg-yellow-500 text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteCrop(crop._id)}
                  className="px-3 py-1 rounded bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700">No crops added yet.</p>
      )}
    </div>
  );
};

export default CropCard;