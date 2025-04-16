const Promotion = ({ promotion }) => {
  console.log(promotion);
  return (
    <div className="m-5">
      <div>
        <div>
          <p className="text-muted-foreground">Số lượng để được khuyến mãi</p>
          <p>{promotion?.quantityToGetPromotion || "Không có dữ liệu"}</p>
        </div>
      </div>
      <div>
        <p className="text-muted-foreground">Khuyến mãi</p>
        <p>{promotion?.bonusQuantity || "Không có dữ liệu"}</p>
      </div>
      
    </div>
  )
}

export default Promotion;