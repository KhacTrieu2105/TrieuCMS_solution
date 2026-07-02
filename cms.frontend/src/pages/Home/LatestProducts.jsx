import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productService from "../../services/productService";

const API_URL = "https://localhost:7186";

const LatestProducts = () => {

    const [products, setProducts] = useState([]);

    useEffect(() => {

        const loadData = async () => {

            try {

                const data = await productService.getLatestProducts();

                setProducts(data);

            }
            catch (error) {

                console.log(error);

            }

        }

        loadData();

    }, []);

    return (

        <div className="bg-white rounded shadow-sm p-4 mb-5">

            <h3 className="fw-bold mb-4">

                🆕 Sản phẩm mới

            </h3>

            <div className="row">

                {

                    products.map(product => (

                        <div className="col-md-4" key={product.id}>

                            <div className="card h-100">

                                <img
                                    src={`${API_URL}${product.imageUrl}`}
                                    className="card-img-top"
                                    style={{
                                        height: 220,
                                        objectFit: "cover"
                                    }}
                                    alt=""
                                />

                                <div className="card-body">

                                    <h5>

                                        {product.name}

                                    </h5>

                                    <h6 className="text-danger">

                                        {product.price.toLocaleString("vi-VN")} ₫

                                    </h6>

                                    <Link
                                        to={`/Product/Details/${product.id}`}
                                        className="btn btn-primary w-100"
                                    >

                                        Xem chi tiết

                                    </Link>

                                </div>

                            </div>

                        </div>

                    ))

                }

            </div>

        </div>

    )

}

export default LatestProducts;