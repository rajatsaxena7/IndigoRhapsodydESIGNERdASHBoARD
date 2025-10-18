import styled from "styled-components";

export const ProductsTableContainer = styled.div`
  .products-table-container {
    .products-table {
      .table-header {
        display: grid;
        grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 1fr;
        gap: 1rem;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 0.5rem;
        margin-bottom: 0.5rem;

        .header-cell {
          font-weight: 600;
          color: #475569;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }

      .table-body {
        .table-row {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 1fr;
          gap: 1rem;
          padding: 1rem;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.2s ease;

          &:hover {
            background: #f8fafc;
          }

          &:last-child {
            border-bottom: none;
          }

          .table-cell {
            display: flex;
            align-items: center;

            &.product {
              .product-info {
                display: flex;
                align-items: center;
                gap: 1rem;

                .product-image {
                  .product-thumbnail {
                    width: 48px;
                    height: 48px;
                    border-radius: 0.5rem;
                    object-fit: cover;
                    cursor: pointer;
                    transition: transform 0.2s ease;

                    &:hover {
                      transform: scale(1.05);
                    }
                  }

                  .no-image {
                    width: 48px;
                    height: 48px;
                    border-radius: 0.5rem;
                    background: #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    color: #64748b;
                    border: 1px dashed #cbd5e1;
                  }
                }

                .product-details {
                  display: flex;
                  flex-direction: column;
                  gap: 0.25rem;

                  .product-name {
                    font-weight: 500;
                    color: #1e293b;
                    font-size: 0.875rem;
                  }

                  .product-sku {
                    font-size: 0.75rem;
                    color: #64748b;
                  }
                }
              }
            }

            &.category {
              .category-info {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;

                .category-name {
                  font-weight: 500;
                  color: #1e293b;
                  font-size: 0.875rem;
                }

                .subcategory-name {
                  font-size: 0.75rem;
                  color: #64748b;
                }
              }
            }

            &.price {
              .price-value {
                font-weight: 600;
                color: #059669;
                font-size: 0.875rem;
              }
            }

            &.variants {
              .variants-info {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;

                .variants-count {
                  font-weight: 500;
                  color: #1e293b;
                  font-size: 0.875rem;
                }

                .variants-details {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 0.25rem;

                  .variant-tag {
                    padding: 0.125rem 0.5rem;
                    background: #f1f5f9;
                    color: #475569;
                    border-radius: 0.375rem;
                    font-size: 0.75rem;
                    font-weight: 500;
                  }

                  .variant-more {
                    font-size: 0.75rem;
                    color: #64748b;
                    font-style: italic;
                  }
                }
              }
            }

            &.status {
              .status-badge {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.25rem 0.75rem;
                border-radius: 9999px;
                font-size: 0.75rem;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.05em;

                .status-text {
                  font-size: 0.75rem;
                }
              }
            }

            &.actions {
              .action-buttons {
                display: flex;
                gap: 0.5rem;

                .action-btn {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 32px;
                  height: 32px;
                  border: none;
                  border-radius: 0.375rem;
                  cursor: pointer;
                  transition: all 0.2s ease;

                  &.view-btn {
                    background: #f1f5f9;
                    color: #475569;

                    &:hover {
                      background: #e2e8f0;
                      color: #1e293b;
                    }
                  }

                  &.edit-btn {
                    background: #3b82f6;
                    color: white;

                    &:hover {
                      background: #2563eb;
                    }
                  }

                  &.toggle-btn {
                    &.activate {
                      background: #059669;
                      color: white;

                      &:hover {
                        background: #047857;
                      }
                    }

                    &.deactivate {
                      background: #dc2626;
                      color: white;

                      &:hover {
                        background: #b91c1c;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;

      .pagination-btn {
        padding: 0.5rem 1rem;
        border: 1px solid #e2e8f0;
        background: white;
        color: #475569;
        border-radius: 0.375rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .page-numbers {
        display: flex;
        gap: 0.25rem;

        .page-btn {
          width: 2.5rem;
          height: 2.5rem;
          border: 1px solid #e2e8f0;
          background: white;
          color: #475569;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background: #f8fafc;
            border-color: #cbd5e1;
          }

          &.active {
            background: #3b82f6;
            color: white;
            border-color: #3b82f6;
          }
        }
      }
    }

    .loading-state,
    .error-state,
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem 1rem;
      text-align: center;
      color: #64748b;

      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e2e8f0;
        border-top: 3px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
      }

      .error-icon,
      .empty-icon {
        margin-bottom: 1rem;
      }

      h3 {
        color: #1e293b;
        font-size: 1.125rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
      }

      p {
        color: #64748b;
        margin: 0;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    }

    /* Modal Styles */
    .image-modal-overlay,
    .view-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;

      .image-modal,
      .view-modal {
        background: white;
        border-radius: 1rem;
        max-width: 90vw;
        max-height: 90vh;
        overflow: auto;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

        .image-modal-header,
        .view-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;

          h3 {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 600;
            color: #1e293b;
          }

          .close-btn {
            background: none;
            border: none;
            color: #64748b;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 0.375rem;
            transition: all 0.2s ease;

            &:hover {
              background: #f1f5f9;
              color: #1e293b;
            }
          }
        }

        .image-modal-body {
          padding: 1.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;

          .modal-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 0.5rem;
            border: 1px solid #e2e8f0;
          }
        }

        .view-modal-body {
          padding: 1.5rem;

          .product-detail-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;

            .detail-item {
              display: flex;
              flex-direction: column;
              gap: 0.5rem;

              &.full-width {
                grid-column: 1 / -1;
              }

              label {
                font-weight: 600;
                color: #475569;
                font-size: 0.875rem;
                text-transform: uppercase;
                letter-spacing: 0.05em;
              }

              span {
                color: #1e293b;
                font-size: 0.875rem;

                &.status-badge {
                  display: inline-flex;
                  align-items: center;
                  gap: 0.5rem;
                  padding: 0.25rem 0.75rem;
                  border-radius: 9999px;
                  font-size: 0.75rem;
                  font-weight: 500;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                  width: fit-content;
                }
              }

              .variants-section {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                margin-top: 0.5rem;

                .variant-card {
                  border: 1px solid #e2e8f0;
                  border-radius: 0.5rem;
                  padding: 1rem;
                  background: #f8fafc;

                  .variant-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.75rem;

                    .variant-color {
                      font-weight: 600;
                      color: #1e293b;
                      font-size: 1rem;
                      margin: 0;
                    }

                    .variant-price {
                      font-weight: 600;
                      color: #059669;
                      font-size: 0.875rem;
                    }
                  }

                  .variant-images {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 0.75rem;

                    .variant-thumbnail {
                      width: 60px;
                      height: 60px;
                      object-fit: cover;
                      border-radius: 0.375rem;
                      cursor: pointer;
                      border: 1px solid #e2e8f0;
                      transition: transform 0.2s ease;

                      &:hover {
                        transform: scale(1.05);
                      }
                    }
                  }

                  .variant-sizes {
                    h5 {
                      font-weight: 600;
                      color: #475569;
                      font-size: 0.875rem;
                      margin: 0 0 0.5rem 0;
                    }

                    .size-grid {
                      display: grid;
                      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                      gap: 0.5rem;

                      .size-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0.5rem;
                        background: white;
                        border-radius: 0.375rem;
                        border: 1px solid #e2e8f0;

                        .size-name {
                          font-weight: 500;
                          color: #1e293b;
                          font-size: 0.875rem;
                        }

                        .size-stock {
                          font-size: 0.75rem;
                          color: #64748b;
                          background: #f1f5f9;
                          padding: 0.125rem 0.375rem;
                          border-radius: 0.25rem;
                        }

                        .size-price {
                          font-weight: 500;
                          color: #059669;
                          font-size: 0.75rem;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .products-table-container {
      .products-table {
        .table-header,
        .table-body .table-row {
          grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
          gap: 0.75rem;

          .header-cell:last-child,
          .table-cell:last-child {
            display: none;
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    .products-table-container {
      .products-table {
        .table-header,
        .table-body .table-row {
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;

          .header-cell:nth-child(n+3),
          .table-cell:nth-child(n+3) {
            display: none;
          }
        }
      }

      .pagination {
        flex-direction: column;
        gap: 1rem;

        .page-numbers {
          order: -1;
        }
      }
    }
  }

  @media (max-width: 480px) {
    .products-table-container {
      .products-table {
        .table-header,
        .table-body .table-row {
          grid-template-columns: 1fr;
          gap: 0.5rem;

          .header-cell:nth-child(n+2),
          .table-cell:nth-child(n+2) {
            display: none;
          }
        }
      }
    }
  }
`;
