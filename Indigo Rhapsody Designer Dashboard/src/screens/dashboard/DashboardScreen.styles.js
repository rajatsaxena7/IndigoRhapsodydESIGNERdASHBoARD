import styled from "styled-components";

export const DashboardScreenWrap = styled.main`
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;

  /* Dashboard Header */
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e2e8f0;

    .header-content {
      .dashboard-title {
        font-size: 2rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 0.5rem 0;
        line-height: 1.2;
      }

      .dashboard-subtitle {
        color: #64748b;
        font-size: 1rem;
        margin: 0;
        line-height: 1.5;
      }
    }

    .header-actions {
      .export-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        color: #475569;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        img {
          width: 16px;
          height: 16px;
        }
      }
    }
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;

    .stat-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      transition: all 0.2s ease;
      border: 1px solid #f1f5f9;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }

      .stat-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          font-weight: 500;

          .trend-indicator {
            font-size: 1rem;
            
            &.trend-up {
              color: #059669;
            }
            
            &.trend-down {
              color: #dc2626;
            }
          }

          .trend-text {
            color: #64748b;
          }
        }
      }

      .stat-content {
        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
          line-height: 1;
        }

        .stat-title {
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }
    }
  }

  /* Recent Orders Section */
  .recent-orders-section {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    margin-bottom: 2rem;
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

      .view-all-btn {
        padding: 0.5rem 1rem;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s ease;

        &:hover {
          background: #2563eb;
        }
      }
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem 1rem;
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

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem 1rem;
      text-align: center;

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
    }

    .orders-table {
      .table-header {
        display: grid;
        grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr;
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
          grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr;
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

            &.amount {
              .amount-value {
                font-weight: 600;
                color: #059669;
              }
            }

            &.status {
              .status-badge {
                padding: 0.25rem 0.75rem;
                border-radius: 9999px;
                font-size: 0.75rem;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.05em;
              }
            }

            &.date {
              .date-text {
                color: #64748b;
                font-size: 0.875rem;
              }
            }

            &.actions {
              .action-btn {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 0.75rem;
                background: #f1f5f9;
                border: none;
                border-radius: 0.375rem;
                color: #475569;
                font-size: 0.875rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;

                &:hover {
                  background: #e2e8f0;
                  color: #1e293b;
                }

                &.view-btn {
                  &:hover {
                    background: #3b82f6;
                    color: white;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  /* Quick Actions */
  .quick-actions {
    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 1rem 0;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;

      .action-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        padding: 1.5rem;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 0.75rem;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border-color: #3b82f6;
        }

        .action-icon {
          width: 48px;
          height: 48px;
          background: #f1f5f9;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #475569;
          transition: all 0.2s ease;
        }

        span {
          font-weight: 500;
          color: #1e293b;
        }

        &:hover .action-icon {
          background: #3b82f6;
          color: white;
        }
      }
    }
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    padding: 1.5rem;

    .dashboard-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    .stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
    }

    .orders-table {
      .table-header,
      .table-body .table-row {
        grid-template-columns: 1fr 1.5fr 1fr 1fr 1fr;
        gap: 0.75rem;

        .header-cell:last-child,
        .table-cell:last-child {
          display: none;
        }
      }
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;

    .dashboard-title {
      font-size: 1.5rem !important;
    }

    .stats-grid {
      grid-template-columns: 1fr;
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

    .actions-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
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

    .actions-grid {
      grid-template-columns: 1fr;
    }
  }
`;
