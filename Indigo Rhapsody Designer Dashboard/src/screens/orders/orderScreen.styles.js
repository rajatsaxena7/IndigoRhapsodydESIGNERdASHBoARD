import styled from "styled-components";

export const OrderScreenWrap = styled.div`
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;

  /* Page Header */
  .page-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e2e8f0;

    .header-content {
      .page-title {
        font-size: 2rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 0.5rem 0;
        line-height: 1.2;
      }

      .page-subtitle {
        color: #64748b;
        font-size: 1rem;
        margin: 0;
        line-height: 1.5;
      }
    }
  }

  /* Stats Section */
  .stats-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;

    .stat-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      border: 1px solid #f1f5f9;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 1rem;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }

      .stat-card-header {
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .stat-content {
        flex: 1;

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.25rem 0;
          line-height: 1;
        }

        .stat-title {
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0;
        }
      }
    }
  }

  /* Search and Filter Section */
  .search-filter-section {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    align-items: center;
    flex-wrap: wrap;

    .search-container {
      flex: 1;
      min-width: 300px;

      .search-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;

        .search-icon {
          position: absolute;
          left: 1rem;
          width: 1.25rem;
          height: 1.25rem;
          color: #64748b;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          background: white;
          transition: all 0.2s ease;

          &:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }

          &::placeholder {
            color: #9ca3af;
          }
        }
      }
    }

    .filter-container {
      .filter-dropdown {
        position: relative;
        display: flex;
        align-items: center;

        .filter-icon {
          position: absolute;
          left: 1rem;
          width: 1.25rem;
          height: 1.25rem;
          color: #64748b;
          z-index: 1;
        }

        .filter-select {
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          background: white;
          font-size: 0.875rem;
          color: #1e293b;
          cursor: pointer;
          min-width: 150px;
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;

          &:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
        }
      }
    }
  }

  /* Orders Section */
  .orders-section {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    border: 1px solid #f1f5f9;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      .section-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1e293b;
        margin: 0;
      }

      .section-actions {
        .results-count {
          color: #64748b;
          font-size: 0.875rem;
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

    .orders-table {
      .table-header {
        display: grid;
        grid-template-columns: 1fr 1.5fr 2fr 1fr 1fr 1fr 1fr;
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
          grid-template-columns: 1fr 1.5fr 2fr 1fr 1fr 1fr 1fr;
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

            &.order-id {
              .order-number {
                font-weight: 600;
                color: #3b82f6;
              }
            }

            &.customer {
              .customer-info {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;

                .customer-name {
                  font-weight: 500;
                  color: #1e293b;
                }

                .customer-location {
                  font-size: 0.875rem;
                  color: #64748b;
                }
              }
            }

            &.products {
              .products-list {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;

                .product-item {
                  font-size: 0.875rem;
                  color: #1e293b;
                }

                .more-products {
                  font-size: 0.75rem;
                  color: #64748b;
                  font-style: italic;
                }
              }
            }

            &.amount {
              .amount-value {
                font-weight: 600;
                color: #059669;
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

            &.date {
              .date-text {
                color: #64748b;
                font-size: 0.875rem;
              }
            }

            &.actions {
              .action-buttons {
                display: flex;
                gap: 0.5rem;

                .action-btn {
                  display: flex;
                  align-items: center;
                  gap: 0.25rem;
                  padding: 0.5rem 0.75rem;
                  border: none;
                  border-radius: 0.375rem;
                  font-size: 0.875rem;
                  font-weight: 500;
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

                  &.ship-btn {
                    background: #3b82f6;
                    color: white;

                    &:hover {
                      background: #2563eb;
                    }
                  }

                  &.cancel-btn {
                    background: #ef4444;
                    color: white;

                    &:hover {
                      background: #dc2626;
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
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    padding: 1.5rem;

    .stats-section {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .search-filter-section {
      flex-direction: column;
      align-items: stretch;

      .search-container {
        min-width: auto;
      }
    }

    .orders-table {
      .table-header,
      .table-body .table-row {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        gap: 0.75rem;

        .header-cell:nth-child(n+6),
        .table-cell:nth-child(n+6) {
          display: none;
        }
      }
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;

    .page-title {
      font-size: 1.5rem !important;
    }

    .stats-section {
      grid-template-columns: 1fr;
    }

    .section-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    .orders-table {
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

  @media (max-width: 480px) {
    .search-filter-section {
      .search-container {
        .search-input-wrapper {
          .search-input {
            font-size: 16px; /* Prevents zoom on iOS */
          }
        }
      }
    }

    .orders-table {
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
`;
