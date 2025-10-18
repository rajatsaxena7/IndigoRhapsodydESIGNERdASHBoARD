import styled from "styled-components";

export const RecentOrderWrap = styled.div`
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;

  /* Page Header */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
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

    .header-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;

      .action-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 0.5rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.875rem;

        &.primary {
          background: #3b82f6;
          color: white;

          &:hover {
            background: #2563eb;
            transform: translateY(-1px);
          }
        }

        &.secondary {
          background: white;
          color: #475569;
          border: 1px solid #e2e8f0;

          &:hover {
            background: #f8fafc;
            border-color: #cbd5e1;
            transform: translateY(-1px);
          }
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

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f1f5f9;
        color: #64748b;

        &.active {
          background: #dcfce7;
          color: #059669;
        }

        &.warning {
          background: #fef3c7;
          color: #d97706;
        }

        &.success {
          background: #dbeafe;
          color: #2563eb;
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

        .stat-label {
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0;
        }
      }
    }
  }

  /* Table Section */
  .table-section {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    border: 1px solid #f1f5f9;

    .table-header {
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

      .table-actions {
        .results-count {
          color: #64748b;
          font-size: 0.875rem;
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

    .table-container {
      overflow-x: auto;
    }
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    padding: 1.5rem;

    .page-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    .search-filter-section {
      flex-direction: column;
      align-items: stretch;

      .search-container {
        min-width: auto;
      }
    }

    .stats-section {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;

    .page-title {
      font-size: 1.5rem !important;
    }

    .header-actions {
      width: 100%;
      justify-content: stretch;

      .action-btn {
        flex: 1;
        justify-content: center;
      }
    }

    .stats-section {
      grid-template-columns: 1fr;
    }

    .table-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
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

    .header-actions {
      flex-direction: column;

      .action-btn {
        width: 100%;
      }
    }
  }
`;
